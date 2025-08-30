export class User {
  constructor(
    public readonly id: string,
    public readonly userId: string, // ID do auth-service
    public readonly name: string,
    public readonly email: string,
    public readonly role: string,
    public readonly avatar?: string,
    public readonly phone?: string,
    public readonly address?: string,
    public readonly city?: string,
    public readonly state?: string,
    public readonly zipCode?: string,
    public readonly country?: string,
    public readonly birthDate?: Date,
    public readonly bio?: string,
    public readonly preferences?: any,
    public readonly isActive?: boolean,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
