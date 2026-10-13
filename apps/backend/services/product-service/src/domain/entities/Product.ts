export interface ProductProps {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  created_at: string;
  created_by: string;
  created_by_id: string;
  updated_at: string;
  updated_by: string;
  updated_by_id: string;
}

export class Product {
  readonly id: number;
  readonly title: string;
  readonly price: number;
  readonly description: string;
  readonly category: string;
  readonly images: string[];
  readonly created_at: string;
  readonly created_by: string;
  readonly created_by_id: string;
  readonly updated_at: string;
  readonly updated_by: string;
  readonly updated_by_id: string;

  constructor(props: ProductProps) {
    this.id = props.id;
    this.title = props.title;
    this.price = props.price;
    this.description = props.description;
    this.category = props.category;
    this.images = props.images;
    this.created_at = props.created_at;
    this.created_by = props.created_by;
    this.created_by_id = props.created_by_id;
    this.updated_at = props.updated_at;
    this.updated_by = props.updated_by;
    this.updated_by_id = props.updated_by_id;
  }

  toJSON(): ProductProps {
    return {
      id: this.id,
      title: this.title,
      price: this.price,
      description: this.description,
      category: this.category,
      images: this.images,
      created_at: this.created_at,
      created_by: this.created_by,
      created_by_id: this.created_by_id,
      updated_at: this.updated_at,
      updated_by: this.updated_by,
      updated_by_id: this.updated_by_id,
    };
  }
}
