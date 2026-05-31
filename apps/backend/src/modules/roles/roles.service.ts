import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Permission,
  PermissionCode,
  PermissionDocument,
  permissionCodes,
} from './schemas/permission.schema';
import { RolePermission, RolePermissionDocument } from './schemas/role-permission.schema';
import {
  AdminRoleCode,
  Role,
  RoleDocument,
} from './schemas/role.schema';

export const initialRoles: Array<{ code: AdminRoleCode; name: string; isActive: boolean }> = [
  { code: 'STAFF', name: 'Staff', isActive: true },
  { code: 'MANAGER', name: 'Manager', isActive: true },
  { code: 'CONTENT_EDITOR', name: 'Content Editor', isActive: true },
  { code: 'ORDER_MANAGER', name: 'Order Manager', isActive: true },
  { code: 'SUPER_ADMIN', name: 'Super Admin', isActive: true },
] as const;

export const initialPermissions: Array<{ code: PermissionCode; name: string; description?: string }> =
  permissionCodes.map((code) => ({
    code,
    name: code,
  }));

const rolePermissionMap: Record<AdminRoleCode, PermissionCode[]> = {
  STAFF: ['orders.read', 'orders.update'],
  MANAGER: [
    'menu.read',
    'menu.write',
    'voucher.read',
    'voucher.write',
    'banner.read',
    'banner.write',
    'gallery.read',
    'gallery.write',
    'website_content.read',
    'website_content.write',
    'orders.read',
    'orders.update',
    'user.read',
  ],
  CONTENT_EDITOR: [
    'banner.read',
    'banner.write',
    'gallery.read',
    'gallery.write',
    'website_content.read',
    'website_content.write',
    'upload.write',
  ],
  ORDER_MANAGER: ['orders.read', 'orders.update'],
  SUPER_ADMIN: [...permissionCodes],
};

export interface RoleWithPermissions {
  id: string;
  code: AdminRoleCode;
  name: string;
  permissions: PermissionCode[];
}

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<PermissionDocument>,
    @InjectModel(RolePermission.name)
    private readonly rolePermissionModel: Model<RolePermissionDocument>,
  ) {}

  findAll() {
    return this.roleModel.find().sort({ code: 1 }).exec();
  }

  findAllPermissions() {
    return this.permissionModel.find({ isActive: true }).sort({ code: 1 }).exec();
  }

  findActiveByCode(code: AdminRoleCode) {
    return this.roleModel.findOne({ code, isActive: true }).exec();
  }

  findById(id: string) {
    return this.roleModel.findById(id).exec();
  }

  async ensureInitialRoles() {
    await Promise.all(
      initialRoles.map((role) =>
        this.roleModel.updateOne(
          { code: role.code },
          { $set: role, $unset: { permissions: '' } },
          { upsert: true },
        ).exec(),
      ),
    );
  }

  async ensureInitialPermissions() {
    await Promise.all(
      initialPermissions.map((permission) =>
        this.permissionModel.updateOne(
          { code: permission.code },
          {
            $set: {
              code: permission.code,
              name: permission.name,
              description: permission.description,
              isActive: true,
            },
          },
          { upsert: true },
        ).exec(),
      ),
    );
  }

  async ensureInitialRolePermissions() {
    await this.ensureInitialRoles();
    await this.ensureInitialPermissions();

    const [roles, permissions] = await Promise.all([
      this.roleModel.find({ code: { $in: initialRoles.map((role) => role.code) } }).exec(),
      this.permissionModel.find({ code: { $in: permissionCodes } }).exec(),
    ]);

    for (const role of roles) {
      const permissionIds = rolePermissionMap[role.code].map((permissionCode) => {
        const permission = permissions.find((item) => item.code === permissionCode);
        if (!permission) {
          throw new Error(`Permission ${permissionCode} is missing.`);
        }
        return permission._id as Types.ObjectId;
      });

      const activePermissionIdStrings = permissionIds.map((id) => id.toString());

      await this.rolePermissionModel.deleteMany({
        roleId: role._id,
        permissionId: { $nin: permissionIds },
      }).exec();

      await Promise.all(
        permissionIds.map((permissionId) =>
          this.rolePermissionModel.updateOne(
            { roleId: role._id, permissionId },
            { $setOnInsert: { roleId: role._id, permissionId } },
            { upsert: true },
          ).exec(),
        ),
      );

      await this.rolePermissionModel.deleteMany({
        roleId: role._id,
        permissionId: {
          $nin: activePermissionIdStrings.map((id) => new Types.ObjectId(id)),
        },
      }).exec();
    }
  }

  async getRoleWithPermissions(roleId: string): Promise<RoleWithPermissions | null> {
    const role = await this.roleModel.findById(roleId).exec();
    if (!role?.isActive) {
      return null;
    }

    const rolePermissions = await this.rolePermissionModel
      .find({ roleId: role._id })
      .exec();
    const permissions = await this.permissionModel
      .find({
        _id: { $in: rolePermissions.map((item) => item.permissionId) },
        isActive: true,
      })
      .sort({ code: 1 })
      .exec();

    return {
      id: role.id,
      code: role.code,
      name: role.name,
      permissions: permissions.map((permission) => permission.code),
    };
  }
}
