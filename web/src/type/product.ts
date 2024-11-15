export type TProduct = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  retailer: string;
  ratings: number;
  AISummary: string;
};

export type TComment = {
  customer: number;
  comment: string;
  rate: number;
  name: string;
};

export type TProductDetail = TProduct & { comments: TComment[] };

export type TSales = {
  [name: string]: {
    [name: string]: {
      price: number;
      quantity: number;
    };
  };
};
