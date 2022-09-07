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
  id: Scalars['ID'];
  name: Scalars['String'];
  parent_id?: Maybe<Scalars['Int']>;
};

export type CreateCategoryInput = {
  name: Scalars['String'];
  parent_id?: InputMaybe<Scalars['Int']>;
};

export type CreateProductInput = {
  category_id: Scalars['ID'];
  company: Scalars['String'];
  description: Scalars['JSON'];
  discount: Scalars['Int'];
  images: Array<InputMaybe<Scalars['String']>>;
  inventory: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['Float'];
  shipping_cost: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCategory: Category;
  createProduct: Product;
  deleteCategory?: Maybe<Scalars['Boolean']>;
  deleteProduct?: Maybe<Product>;
  deleteUser?: Maybe<User>;
  logout: Scalars['Boolean'];
  updateCategory: Category;
  updateProduct: Product;
  updateUser: User;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
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
  category_id: Scalars['ID'];
  company: Scalars['String'];
  created_at: Scalars['Date'];
  description: Scalars['JSON'];
  discount: Scalars['Int'];
  id: Scalars['ID'];
  images: Array<Maybe<Scalars['String']>>;
  inventory: Scalars['Int'];
  name: Scalars['String'];
  num_of_reviews: Scalars['Int'];
  price: Scalars['Float'];
  shipping_cost: Scalars['Float'];
  updated_at: Scalars['Date'];
};

export type Query = {
  __typename?: 'Query';
  categories?: Maybe<Array<Category>>;
  products?: Maybe<Array<Maybe<Product>>>;
  showMe?: Maybe<User>;
  user?: Maybe<User>;
  users?: Maybe<UsersResult>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export enum Role {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  User = 'USER'
}

export type UpdateCategoryInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
  parent_id?: InputMaybe<Scalars['Int']>;
};

export type UpdateProductInput = {
  category_id: Scalars['ID'];
  company: Scalars['String'];
  description: Scalars['JSON'];
  discount: Scalars['Int'];
  images: Array<InputMaybe<Scalars['String']>>;
  inventory: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['Float'];
  shipping_cost: Scalars['Float'];
};

export type UpdateUserInput = {
  address?: InputMaybe<Scalars['String']>;
  avatar?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  family_name?: InputMaybe<Scalars['String']>;
  given_name?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  role: Role;
};

export type User = {
  __typename?: 'User';
  address?: Maybe<Scalars['String']>;
  avatar: Scalars['String'];
  created_at: Scalars['Date'];
  email?: Maybe<Scalars['String']>;
  family_name: Scalars['String'];
  given_name: Scalars['String'];
  id: Scalars['ID'];
  platform: Platform;
  platform_id: Scalars['String'];
  role: Role;
};

export type UsersErrorResult = {
  __typename?: 'UsersErrorResult';
  message: Scalars['String'];
};

export type UsersQueryResult = {
  __typename?: 'UsersQueryResult';
  users?: Maybe<Array<User>>;
};

export type UsersResult = UsersErrorResult | UsersQueryResult;



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
  CreateCategoryInput: CreateCategoryInput;
  CreateProductInput: CreateProductInput;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  Mutation: ResolverTypeWrapper<{}>;
  Platform: Platform;
  Product: ResolverTypeWrapper<Product>;
  Query: ResolverTypeWrapper<{}>;
  Role: Role;
  String: ResolverTypeWrapper<Scalars['String']>;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateProductInput: UpdateProductInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
  UsersErrorResult: ResolverTypeWrapper<UsersErrorResult>;
  UsersQueryResult: ResolverTypeWrapper<UsersQueryResult>;
  UsersResult: ResolversTypes['UsersErrorResult'] | ResolversTypes['UsersQueryResult'];
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Category: Category;
  CreateCategoryInput: CreateCategoryInput;
  CreateProductInput: CreateProductInput;
  Date: Scalars['Date'];
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  Mutation: {};
  Product: Product;
  Query: {};
  String: Scalars['String'];
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateProductInput: UpdateProductInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
  UsersErrorResult: UsersErrorResult;
  UsersQueryResult: UsersQueryResult;
  UsersResult: ResolversParentTypes['UsersErrorResult'] | ResolversParentTypes['UsersQueryResult'];
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parent_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'input'>>;
  createProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationCreateProductArgs, 'input'>>;
  deleteCategory?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'id'>>;
  deleteProduct?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<MutationDeleteProductArgs, 'id'>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  updateCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationUpdateCategoryArgs, 'input'>>;
  updateProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationUpdateProductArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
};

export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = {
  avg_rating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  category_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  company?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  discount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  images?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  inventory?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  num_of_reviews?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  shipping_cost?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  categories?: Resolver<Maybe<Array<ResolversTypes['Category']>>, ParentType, ContextType>;
  products?: Resolver<Maybe<Array<Maybe<ResolversTypes['Product']>>>, ParentType, ContextType>;
  showMe?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Maybe<ResolversTypes['UsersResult']>, ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  avatar?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  family_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  given_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  platform?: Resolver<ResolversTypes['Platform'], ParentType, ContextType>;
  platform_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersErrorResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UsersErrorResult'] = ResolversParentTypes['UsersErrorResult']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersQueryResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UsersQueryResult'] = ResolversParentTypes['UsersQueryResult']> = {
  users?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UsersResult'] = ResolversParentTypes['UsersResult']> = {
  __resolveType: TypeResolveFn<'UsersErrorResult' | 'UsersQueryResult', ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Category?: CategoryResolvers<ContextType>;
  Date?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UsersErrorResult?: UsersErrorResultResolvers<ContextType>;
  UsersQueryResult?: UsersQueryResultResolvers<ContextType>;
  UsersResult?: UsersResultResolvers<ContextType>;
};

