import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  JSON: any;
};

export type Category = {
  __typename?: 'Category';
  companies?: Maybe<Array<Company>>;
  id: Scalars['Int'];
  img_id?: Maybe<Scalars['String']>;
  img_src?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  parent_id?: Maybe<Scalars['Int']>;
  productCount?: Maybe<Scalars['Int']>;
};

export type Company = {
  __typename?: 'Company';
  categories?: Maybe<Array<Category>>;
  id: Scalars['Int'];
  name: Scalars['String'];
  productCount?: Maybe<Scalars['Int']>;
};

export type CreateCategoryInput = {
  img_id?: InputMaybe<Scalars['String']>;
  img_src?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  parent_id?: InputMaybe<Scalars['Int']>;
};

export type CreateCompanyInput = {
  name: Scalars['String'];
};

export type CreateProductInput = {
  category_id: Scalars['Int'];
  company_id: Scalars['Int'];
  description: Scalars['JSON'];
  discount: Scalars['Int'];
  img_id: Array<Scalars['String']>;
  img_src: Array<Scalars['String']>;
  inventory: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['Float'];
  shipping_cost: Scalars['Float'];
  variants?: InputMaybe<Array<Scalars['Int']>>;
};

export type Image = {
  __typename?: 'Image';
  img_id: Scalars['String'];
  img_src: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelOrder: Scalars['Boolean'];
  createCategory: Scalars['Boolean'];
  createCompany: Scalars['Boolean'];
  createProduct: Scalars['Boolean'];
  deleteCategory: Scalars['Boolean'];
  deleteCompany: Scalars['Boolean'];
  deleteOrder: Scalars['Boolean'];
  deleteProduct: Scalars['Boolean'];
  updateCategory: Scalars['Boolean'];
  updateCompany: Scalars['Boolean'];
  updateProduct: Scalars['Boolean'];
  updateUser: Scalars['Boolean'];
};


export type MutationcancelOrderArgs = {
  id: Scalars['Int'];
};


export type MutationcreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationcreateCompanyArgs = {
  input: CreateCompanyInput;
};


export type MutationcreateProductArgs = {
  input: CreateProductInput;
};


export type MutationdeleteCategoryArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteCompanyArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteOrderArgs = {
  id: Scalars['Int'];
};


export type MutationdeleteProductArgs = {
  id: Scalars['Int'];
};


export type MutationupdateCategoryArgs = {
  input: UpdateCategoryInput;
};


export type MutationupdateCompanyArgs = {
  input: UpdateCompanyInput;
};


export type MutationupdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationupdateUserArgs = {
  input: UpdateUserInput;
};

export type Order = {
  __typename?: 'Order';
  buyer_email: Scalars['String'];
  buyer_name: Scalars['String'];
  buyer_phone?: Maybe<Scalars['String']>;
  created_at: Scalars['Date'];
  delivery_address: Scalars['String'];
  id: Scalars['Int'];
  order_items: Array<SingleOrderItem>;
  shipping_cost: Scalars['Float'];
  status: Status;
  user_id?: Maybe<Scalars['Int']>;
};

export enum Platform {
  FACEBOOK = 'FACEBOOK',
  GOOGLE = 'GOOGLE'
}

export type Product = {
  __typename?: 'Product';
  _count: ProductOrdersCount;
  category: Category;
  company: Company;
  created_at: Scalars['Date'];
  description: Scalars['JSON'];
  discount: Scalars['Int'];
  id: Scalars['Int'];
  images: Array<Image>;
  inventory: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['Float'];
  shipping_cost: Scalars['Float'];
  updated_at: Scalars['Date'];
  variants: Array<Product>;
};

export type ProductOrdersCount = {
  __typename?: 'ProductOrdersCount';
  orders: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  categories: Array<Category>;
  companies: Array<Company>;
  featuredProducts: Array<Product>;
  filteredProducts: Array<Product>;
  orders: Array<Order>;
  popularProducts: Array<Product>;
  product?: Maybe<Product>;
  products: Array<Product>;
  productsById: Array<Product>;
  relatedProducts: Array<Product>;
  searchBarQuery: QuerySearchBarResult;
  searchData: QuerySearchDataResult;
  showMe?: Maybe<User>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
};


export type QueryfeaturedProductsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryfilteredProductsArgs = {
  input: QueryProductInput;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QuerypopularProductsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryproductArgs = {
  id: Scalars['Int'];
};


export type QueryproductsByIdArgs = {
  ids: Array<Scalars['Int']>;
};


export type QueryrelatedProductsArgs = {
  input: QueryRelatedInput;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QuerysearchBarQueryArgs = {
  input: Scalars['String'];
};


export type QuerysearchDataArgs = {
  input: QuerySearchDataInput;
};


export type QueryuserArgs = {
  id: Scalars['Int'];
};

export type QueryProductInput = {
  category_id?: InputMaybe<Scalars['Int']>;
  company_id?: InputMaybe<Scalars['Int']>;
  max_price?: InputMaybe<Scalars['Int']>;
  min_price?: InputMaybe<Scalars['Int']>;
  search_string?: InputMaybe<Scalars['String']>;
  sortMode?: InputMaybe<Scalars['Int']>;
};

export type QueryRelatedInput = {
  category_id: Scalars['Int'];
  company_id: Scalars['Int'];
  id: Scalars['Int'];
};

export type QuerySearchBarResult = {
  __typename?: 'QuerySearchBarResult';
  categories: Array<SearchObject>;
  companies: Array<SearchObject>;
  products: Array<SearchObject>;
};

export type QuerySearchDataInput = {
  category_id?: InputMaybe<Scalars['Int']>;
  company_id?: InputMaybe<Scalars['Int']>;
  max_price?: InputMaybe<Scalars['Int']>;
  min_price?: InputMaybe<Scalars['Int']>;
  search_string?: InputMaybe<Scalars['String']>;
};

export type QuerySearchDataResult = {
  __typename?: 'QuerySearchDataResult';
  categories: Array<Category>;
  companies: Array<Company>;
  max: Scalars['Int'];
  min: Scalars['Int'];
};

export enum Role {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  USER = 'USER'
}

export type SearchObject = {
  __typename?: 'SearchObject';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type SingleOrderItem = {
  __typename?: 'SingleOrderItem';
  amount: Scalars['Int'];
  id: Scalars['Int'];
  order_id: Scalars['Int'];
  price: Scalars['Float'];
  product: Product;
  product_id: Scalars['Int'];
};

export enum Status {
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING'
}

export type UpdateCategoryInput = {
  id: Scalars['Int'];
  img_id?: InputMaybe<Scalars['String']>;
  img_src?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  parent_id?: InputMaybe<Scalars['Int']>;
};

export type UpdateCompanyInput = {
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type UpdateProductInput = {
  category_id: Scalars['Int'];
  company_id: Scalars['Int'];
  description: Scalars['JSON'];
  discount: Scalars['Int'];
  id: Scalars['Int'];
  img_id: Array<Scalars['String']>;
  img_src: Array<Scalars['String']>;
  inventory: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['Float'];
  shipping_cost: Scalars['Float'];
  variants?: InputMaybe<Array<Scalars['Int']>>;
};

export type UpdateUserInput = {
  address?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  family_name: Scalars['String'];
  given_name: Scalars['String'];
  id: Scalars['Int'];
  phone?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  address?: Maybe<Scalars['String']>;
  avatar: Scalars['String'];
  created_at: Scalars['Date'];
  email?: Maybe<Scalars['String']>;
  family_name: Scalars['String'];
  given_name: Scalars['String'];
  id: Scalars['Int'];
  phone?: Maybe<Scalars['String']>;
  platform: Platform;
  platform_id: Scalars['String'];
  role: Array<Role>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Category: ResolverTypeWrapper<Category>;
  Company: ResolverTypeWrapper<Company>;
  CreateCategoryInput: CreateCategoryInput;
  CreateCompanyInput: CreateCompanyInput;
  CreateProductInput: CreateProductInput;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Image: ResolverTypeWrapper<Image>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  Mutation: ResolverTypeWrapper<{}>;
  Order: ResolverTypeWrapper<Order>;
  Platform: Platform;
  Product: ResolverTypeWrapper<Product>;
  ProductOrdersCount: ResolverTypeWrapper<ProductOrdersCount>;
  Query: ResolverTypeWrapper<{}>;
  QueryProductInput: QueryProductInput;
  QueryRelatedInput: QueryRelatedInput;
  QuerySearchBarResult: ResolverTypeWrapper<QuerySearchBarResult>;
  QuerySearchDataInput: QuerySearchDataInput;
  QuerySearchDataResult: ResolverTypeWrapper<QuerySearchDataResult>;
  Role: Role;
  SearchObject: ResolverTypeWrapper<SearchObject>;
  SingleOrderItem: ResolverTypeWrapper<SingleOrderItem>;
  Status: Status;
  String: ResolverTypeWrapper<Scalars['String']>;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateCompanyInput: UpdateCompanyInput;
  UpdateProductInput: UpdateProductInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Category: Category;
  Company: Company;
  CreateCategoryInput: CreateCategoryInput;
  CreateCompanyInput: CreateCompanyInput;
  CreateProductInput: CreateProductInput;
  Date: Scalars['Date'];
  Float: Scalars['Float'];
  Image: Image;
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  Mutation: {};
  Order: Order;
  Product: Product;
  ProductOrdersCount: ProductOrdersCount;
  Query: {};
  QueryProductInput: QueryProductInput;
  QueryRelatedInput: QueryRelatedInput;
  QuerySearchBarResult: QuerySearchBarResult;
  QuerySearchDataInput: QuerySearchDataInput;
  QuerySearchDataResult: QuerySearchDataResult;
  SearchObject: SearchObject;
  SingleOrderItem: SingleOrderItem;
  String: Scalars['String'];
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateCompanyInput: UpdateCompanyInput;
  UpdateProductInput: UpdateProductInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  companies?: Resolver<Maybe<Array<ResolversTypes['Company']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  img_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  img_src?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parent_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  productCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']> = {
  categories?: Resolver<Maybe<Array<ResolversTypes['Category']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = {
  img_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  img_src?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JSONScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  cancelOrder?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationcancelOrderArgs, 'id'>>;
  createCategory?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationcreateCategoryArgs, 'input'>>;
  createCompany?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationcreateCompanyArgs, 'input'>>;
  createProduct?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationcreateProductArgs, 'input'>>;
  deleteCategory?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationdeleteCategoryArgs, 'id'>>;
  deleteCompany?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationdeleteCompanyArgs, 'id'>>;
  deleteOrder?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationdeleteOrderArgs, 'id'>>;
  deleteProduct?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationdeleteProductArgs, 'id'>>;
  updateCategory?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationupdateCategoryArgs, 'input'>>;
  updateCompany?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationupdateCompanyArgs, 'input'>>;
  updateProduct?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationupdateProductArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationupdateUserArgs, 'input'>>;
};

export type OrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = {
  buyer_email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  buyer_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  buyer_phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  delivery_address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  order_items?: Resolver<Array<ResolversTypes['SingleOrderItem']>, ParentType, ContextType>;
  shipping_cost?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  user_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = {
  _count?: Resolver<ResolversTypes['ProductOrdersCount'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['Category'], ParentType, ContextType>;
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  discount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  images?: Resolver<Array<ResolversTypes['Image']>, ParentType, ContextType>;
  inventory?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  shipping_cost?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  variants?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductOrdersCountResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductOrdersCount'] = ResolversParentTypes['ProductOrdersCount']> = {
  orders?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  companies?: Resolver<Array<ResolversTypes['Company']>, ParentType, ContextType>;
  featuredProducts?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryfeaturedProductsArgs, 'limit' | 'offset'>>;
  filteredProducts?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryfilteredProductsArgs, 'input' | 'limit' | 'offset'>>;
  orders?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
  popularProducts?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QuerypopularProductsArgs, 'limit' | 'offset'>>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryproductArgs, 'id'>>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  productsById?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryproductsByIdArgs, 'ids'>>;
  relatedProducts?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryrelatedProductsArgs, 'input' | 'limit' | 'offset'>>;
  searchBarQuery?: Resolver<ResolversTypes['QuerySearchBarResult'], ParentType, ContextType, RequireFields<QuerysearchBarQueryArgs, 'input'>>;
  searchData?: Resolver<ResolversTypes['QuerySearchDataResult'], ParentType, ContextType, RequireFields<QuerysearchDataArgs, 'input'>>;
  showMe?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserArgs, 'id'>>;
  users?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
};

export type QuerySearchBarResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuerySearchBarResult'] = ResolversParentTypes['QuerySearchBarResult']> = {
  categories?: Resolver<Array<ResolversTypes['SearchObject']>, ParentType, ContextType>;
  companies?: Resolver<Array<ResolversTypes['SearchObject']>, ParentType, ContextType>;
  products?: Resolver<Array<ResolversTypes['SearchObject']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QuerySearchDataResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuerySearchDataResult'] = ResolversParentTypes['QuerySearchDataResult']> = {
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  companies?: Resolver<Array<ResolversTypes['Company']>, ParentType, ContextType>;
  max?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  min?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SearchObjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchObject'] = ResolversParentTypes['SearchObject']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SingleOrderItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['SingleOrderItem'] = ResolversParentTypes['SingleOrderItem']> = {
  amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  order_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  product_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  avatar?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  family_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  given_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  platform?: Resolver<ResolversTypes['Platform'], ParentType, ContextType>;
  platform_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Category?: CategoryResolvers<ContextType>;
  Company?: CompanyResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Image?: ImageResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  ProductOrdersCount?: ProductOrdersCountResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  QuerySearchBarResult?: QuerySearchBarResultResolvers<ContextType>;
  QuerySearchDataResult?: QuerySearchDataResultResolvers<ContextType>;
  SearchObject?: SearchObjectResolvers<ContextType>;
  SingleOrderItem?: SingleOrderItemResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

