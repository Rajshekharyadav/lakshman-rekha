import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phoneNumber: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByPhone(phoneNumber: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.phoneNumber === phoneNumber,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      username: insertUser.username ?? null,
      email: insertUser.email ?? null,
      phoneNumber: insertUser.phoneNumber ?? null,
      passwordHash: insertUser.passwordHash ?? null,
      displayName: insertUser.displayName ?? null,
      photoURL: insertUser.photoURL ?? null,
      authProvider: insertUser.authProvider ?? 'username',
      location: insertUser.location ?? null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
