export interface UserProps {
  id: number;
  username: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export class User {
  readonly id: number;
  readonly username: string;
  readonly password_hash: string;
  readonly created_at: Date;
  readonly updated_at: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.username = props.username;
    this.password_hash = props.password_hash;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      created_at: this.created_at.toISOString(),
      updated_at: this.updated_at.toISOString(),
    };
  }
}
