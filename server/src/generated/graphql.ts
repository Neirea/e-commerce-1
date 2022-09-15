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
  parent?: Maybe<Category>;
};

export type Company = {
  __typename?: 'Company';
  categories?: Maybe<Array<Category>>;
  id: Scalars['Int'];
  name: Scalars['String'];
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
};

export type Image = {
  __typename?: 'Image';
  img_id: Scalars['String'];
  img_src: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCategory: Scalars['Boolean'];
  createCompany: Scalars['Boolean'];
  createProduct: Scalars['Boolean'];
  deleteCategory: Scalars['Boolean'];
  deleteCompany: Scalars['Boolean'];
  deleteProduct: Scalars['Boolean'];
  logout: Scalars['Boolean'];
  updateCategory: Scalars['Boolean'];
  updateCompany: Scalars['Boolean'];
  updateProduct: Scalars['Boolean'];
  updateUser: Scalars['Boolean'];
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteCompanyArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['Int'];
};


export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
};


export type MutationUpdateCompanyArgs = {
  input: UpdateCompanyInput;
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export enum Platform {
  Facebook = 'FACEBOOK',
  Google = 'GOOGLE'
}

export type Product = {
  __typename?: 'Product';
  avg_rating: Scalars['Float'];
  category: Category;
  company: Company;
  created_at: Scalars['Date'];
  description: Scalars['JSON'];
  discount: Scalars['Int'];
  id: Scalars['Int'];
  images?: Maybe<Array<Image>>;
  inventory: Scalars['Int'];
  name: Scalars['String'];
  num_of_reviews: Scalars['Int'];
  price: Scalars['Float'];
  shipping_cost: Scalars['Float'];
  updated_at: Scalars['Date'];
};

export type Query = {
  __typename?: 'Query';
  categories: Array<Category>;
  companies: Array<Company>;
  products: Array<Product>;
  showMe?: Maybe<User>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};

export enum Role {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  User = 'USER'
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
  Platform: Platform;
  Product: ResolverTypeWrapper<Product>;
  Query: ResolverTypeWrapper<{}>;
  Role: Role;
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
  Product: Product;
  Query: {};
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
  parent?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']> = {
  categories?: Resolver<Maybe<Array<ResolversTypes['Category']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createCategory?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'input'>>;
  createCompany?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationCreateCompanyArgs, 'input'>>;
  createProduct?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationCreateProductArgs, 'input'>>;
  deleteCategory?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'id'>>;
  deleteCompany?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCompanyArgs, 'id'>>;
  deleteProduct?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteProductArgs, 'id'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  updateCategory?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateCategoryArgs, 'input'>>;
  updateCompany?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateCompanyArgs, 'input'>>;
  updateProduct?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateProductArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
};

export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = {
  avg_rating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['Category'], ParentType, ContextType>;
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  discount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  images?: Resolver<Maybe<Array<ResolversTypes['Image']>>, ParentType, ContextType>;
  inventory?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  num_of_reviews?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  shipping_cost?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  companies?: Resolver<Array<ResolversTypes['Company']>, ParentType, ContextType>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  showMe?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
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
  Product?: ProductResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

