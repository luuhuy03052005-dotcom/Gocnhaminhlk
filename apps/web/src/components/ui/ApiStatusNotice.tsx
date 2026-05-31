interface ApiStatusNoticeProps {
  message: string | null;
}

export const ApiStatusNotice = ({ message }: ApiStatusNoticeProps) => {
  if (!message) return null;

  return (
    <div className="sticky top-0 z-50 border-b border-[#EDE4D8] bg-[#FDF6EE]/95 px-4 py-3 text-center text-sm font-medium text-[#6A5A4A] backdrop-blur-md">
      {message}
    </div>
  );
};

