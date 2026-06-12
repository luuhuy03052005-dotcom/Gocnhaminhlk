type PlainRecord = Record<string, unknown>;

interface MaybeMongoDocument {
  id?: string;
  toObject?: (options?: { virtuals?: boolean }) => PlainRecord;
}

export function serializeMongoDocument(document: unknown): PlainRecord {
  const maybeDocument = document as MaybeMongoDocument;
  const plain =
    typeof maybeDocument.toObject === 'function'
      ? maybeDocument.toObject({ virtuals: true })
      : (document as PlainRecord);
  const id =
    typeof maybeDocument.id === 'string'
      ? maybeDocument.id
      : stringifyMongoValue(plain._id);
  const { _id, __v, id: _plainId, ...rest } = plain;

  return {
    id,
    ...serializePlainObject(rest),
  };
}

export function serializePlainObject(value: PlainRecord): PlainRecord {
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, stringifyMongoValue(item)]),
  );
}

function stringifyMongoValue(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => stringifyMongoValue(item));
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  if (
    'toHexString' in value &&
    typeof (value as { toHexString: () => string }).toHexString === 'function'
  ) {
    return (value as { toHexString: () => string }).toHexString();
  }

  return serializePlainObject(value as PlainRecord);
}
