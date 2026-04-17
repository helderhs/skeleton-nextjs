import dbConnect from '@/lib/mongodb';
import User, { IUserDocument } from '@/models/User';
import { hashPassword } from '@/lib/password';
import type {
  CreateUserDTO,
  PaginatedResult,
  ThemeMode,
  UpdateUserDTO,
  UserResponse,
  UserRole,
} from '@/types';

interface ListUsersOptions {
  search?: string;
  page?: number;
  pageSize?: number;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeRole(role: string | undefined): UserRole {
  return role === 'admin' ? 'admin' : 'user';
}

export function normalizeThemeMode(themeMode: string | undefined): ThemeMode {
  return themeMode === 'light' ? 'light' : 'dark';
}

function toUserResponse(doc: IUserDocument): UserResponse {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    role: normalizeRole(doc.role),
    themeMode: normalizeThemeMode(doc.themeMode),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function createUser(data: CreateUserDTO): Promise<UserResponse> {
  await dbConnect();

  const normalizedEmail = normalizeEmail(data.email);
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new Error('Este email ja esta cadastrado');
  }

  const hashedPassword = await hashPassword(data.password);
  const user = await User.create({
    ...data,
    email: normalizedEmail,
    role: normalizeRole(data.role),
    themeMode: normalizeThemeMode(data.themeMode),
    password: hashedPassword,
  });

  return toUserResponse(user);
}

export async function findUserByEmail(
  email: string
): Promise<IUserDocument | null> {
  await dbConnect();
  return User.findOne({ email: normalizeEmail(email) });
}

export async function findUserById(id: string): Promise<UserResponse | null> {
  await dbConnect();
  const user = await User.findById(id);

  if (!user) {
    return null;
  }

  return toUserResponse(user);
}

export async function listUsers(
  options: ListUsersOptions = {}
): Promise<PaginatedResult<UserResponse>> {
  await dbConnect();

  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, options.pageSize ?? 10));
  const search = options.search?.trim() ?? '';

  const filter = search
    ? {
        $or: [
          { name: { $regex: escapeRegex(search), $options: 'i' } },
          { email: { $regex: escapeRegex(search), $options: 'i' } },
          { role: { $regex: escapeRegex(search), $options: 'i' } },
        ],
      }
    : {};

  const skip = (page - 1) * pageSize;
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
    User.countDocuments(filter),
  ]);

  return {
    items: users.map(toUserResponse),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function updateUser(
  id: string,
  data: UpdateUserDTO
): Promise<UserResponse | null> {
  await dbConnect();

  const updateData = { ...data };

  if (updateData.email) {
    const normalizedEmail = normalizeEmail(updateData.email);
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser && existingUser._id.toString() !== id) {
      throw new Error('Este email ja esta cadastrado');
    }

    updateData.email = normalizedEmail;
  }

  if (updateData.role !== undefined) {
    updateData.role = normalizeRole(updateData.role);
  }

  if (updateData.themeMode !== undefined) {
    updateData.themeMode = normalizeThemeMode(updateData.themeMode);
  }

  if (updateData.password) {
    updateData.password = await hashPassword(updateData.password);
  }

  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return null;
  }

  return toUserResponse(user);
}

export async function deleteUser(id: string): Promise<boolean> {
  await dbConnect();
  const result = await User.findByIdAndDelete(id);
  return !!result;
}
