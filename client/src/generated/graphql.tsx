import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
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
  categories: Array<SearchCategory>;
  companies: Array<SearchCompany>;
  products: Array<SearchProduct>;
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

export type SearchCategory = {
  __typename?: 'SearchCategory';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type SearchCompany = {
  __typename?: 'SearchCompany';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type SearchProduct = {
  __typename?: 'SearchProduct';
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
  csrfToken?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  family_name: Scalars['String'];
  given_name: Scalars['String'];
  id: Scalars['Int'];
  phone?: Maybe<Scalars['String']>;
  platform: Platform;
  platform_id: Scalars['String'];
  role: Array<Role>;
};

export type GetAllCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: number, name: string, img_src?: string | null, parent_id?: number | null, companies?: Array<{ __typename?: 'Company', id: number, name: string }> | null }> };

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: boolean };

export type UpdateCategoryMutationVariables = Exact<{
  input: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: boolean };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: boolean };

export type GetAllCompaniesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCompaniesQuery = { __typename?: 'Query', companies: Array<{ __typename?: 'Company', id: number, name: string }> };

export type CreateCompanyMutationVariables = Exact<{
  input: CreateCompanyInput;
}>;


export type CreateCompanyMutation = { __typename?: 'Mutation', createCompany: boolean };

export type UpdateCompanyMutationVariables = Exact<{
  input: UpdateCompanyInput;
}>;


export type UpdateCompanyMutation = { __typename?: 'Mutation', updateCompany: boolean };

export type DeleteCompanyMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteCompanyMutation = { __typename?: 'Mutation', deleteCompany: boolean };

export type GetAllOrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllOrdersQuery = { __typename?: 'Query', orders: Array<{ __typename?: 'Order', id: number, status: Status, user_id?: number | null, buyer_name: string, buyer_email: string, buyer_phone?: string | null, delivery_address: string, shipping_cost: number, created_at: any, order_items: Array<{ __typename?: 'SingleOrderItem', amount: number, price: number, product: { __typename?: 'Product', id: number, name: string, price: number, discount: number } }> }> };

export type CancelOrderMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type CancelOrderMutation = { __typename?: 'Mutation', cancelOrder: boolean };

export type GetSearchResultsQueryVariables = Exact<{
  input: Scalars['String'];
}>;


export type GetSearchResultsQuery = { __typename?: 'Query', searchBarQuery: { __typename?: 'QuerySearchBarResult', categories: Array<{ __typename?: 'SearchCategory', id: number, name: string }>, companies: Array<{ __typename?: 'SearchCompany', id: number, name: string }>, products: Array<{ __typename?: 'SearchProduct', id: number, name: string }> } };

export type GetAllProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllProductsQuery = { __typename?: 'Query', products: Array<{ __typename?: 'Product', id: number, name: string, price: number, description: any, inventory: number, shipping_cost: number, discount: number, company: { __typename?: 'Company', id: number, name: string }, category: { __typename?: 'Category', id: number, name: string, parent_id?: number | null }, images: Array<{ __typename?: 'Image', img_src: string }>, variants: Array<{ __typename?: 'Product', id: number }> }> };

export type GetProductsByIdQueryVariables = Exact<{
  ids: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type GetProductsByIdQuery = { __typename?: 'Query', productsById: Array<{ __typename?: 'Product', id: number, name: string, price: number, inventory: number, shipping_cost: number, discount: number, images: Array<{ __typename?: 'Image', img_src: string }> }> };

export type GetFilteredProductsQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  input: QueryProductInput;
}>;


export type GetFilteredProductsQuery = { __typename?: 'Query', filteredProducts: Array<{ __typename?: 'Product', id: number, name: string, price: number, inventory: number, discount: number, images: Array<{ __typename?: 'Image', img_src: string }>, company: { __typename?: 'Company', id: number, name: string }, _count: { __typename?: 'ProductOrdersCount', orders: number } }> };

export type GetSearchDataQueryVariables = Exact<{
  input: QuerySearchDataInput;
}>;


export type GetSearchDataQuery = { __typename?: 'Query', searchData: { __typename?: 'QuerySearchDataResult', min: number, max: number, categories: Array<{ __typename?: 'Category', id: number, name: string, parent_id?: number | null, productCount?: number | null }>, companies: Array<{ __typename?: 'Company', id: number, name: string, productCount?: number | null }> } };

export type GetFeaturedProductsQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;


export type GetFeaturedProductsQuery = { __typename?: 'Query', featuredProducts: Array<{ __typename?: 'Product', id: number, name: string, price: number, inventory: number, discount: number, images: Array<{ __typename?: 'Image', img_src: string }> }> };

export type GetPopularProductsQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;


export type GetPopularProductsQuery = { __typename?: 'Query', popularProducts: Array<{ __typename?: 'Product', id: number, name: string, price: number, inventory: number, discount: number, images: Array<{ __typename?: 'Image', img_src: string }> }> };

export type GetRelatedProductsQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  input: QueryRelatedInput;
}>;


export type GetRelatedProductsQuery = { __typename?: 'Query', relatedProducts: Array<{ __typename?: 'Product', id: number, name: string, price: number, inventory: number, discount: number, images: Array<{ __typename?: 'Image', img_src: string }> }> };

export type GetSingleProductQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetSingleProductQuery = { __typename?: 'Query', product?: { __typename?: 'Product', id: number, name: string, price: number, description: any, inventory: number, shipping_cost: number, discount: number, company: { __typename?: 'Company', id: number, name: string }, category: { __typename?: 'Category', id: number, name: string }, images: Array<{ __typename?: 'Image', img_id: string, img_src: string }>, variants: Array<{ __typename?: 'Product', id: number, name: string, images: Array<{ __typename?: 'Image', img_src: string }> }> } | null };

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct: boolean };

export type UpdateProductMutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', updateProduct: boolean };

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct: boolean };

export type ShowCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type ShowCurrentUserQuery = { __typename?: 'Query', showMe?: { __typename?: 'User', id: number, given_name: string, family_name: string, email?: string | null, address?: string | null, phone?: string | null, avatar: string, role: Array<Role>, csrfToken?: string | null } | null };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: boolean };


export const GetAllCategoriesDocument = gql`
    query GetAllCategories {
  categories {
    id
    name
    img_src
    parent_id
    companies {
      id
      name
    }
  }
}
    `;

/**
 * __useGetAllCategoriesQuery__
 *
 * To run a query within a React component, call `useGetAllCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllCategoriesQuery, GetAllCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllCategoriesQuery, GetAllCategoriesQueryVariables>(GetAllCategoriesDocument, options);
      }
export function useGetAllCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCategoriesQuery, GetAllCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllCategoriesQuery, GetAllCategoriesQueryVariables>(GetAllCategoriesDocument, options);
        }
export type GetAllCategoriesQueryHookResult = ReturnType<typeof useGetAllCategoriesQuery>;
export type GetAllCategoriesLazyQueryHookResult = ReturnType<typeof useGetAllCategoriesLazyQuery>;
export type GetAllCategoriesQueryResult = Apollo.QueryResult<GetAllCategoriesQuery, GetAllCategoriesQueryVariables>;
export const CreateCategoryDocument = gql`
    mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input)
}
    `;
export type CreateCategoryMutationFn = Apollo.MutationFunction<CreateCategoryMutation, CreateCategoryMutationVariables>;

/**
 * __useCreateCategoryMutation__
 *
 * To run a mutation, you first call `useCreateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCategoryMutation, { data, loading, error }] = useCreateCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateCategoryMutation, CreateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument, options);
      }
export type CreateCategoryMutationHookResult = ReturnType<typeof useCreateCategoryMutation>;
export type CreateCategoryMutationResult = Apollo.MutationResult<CreateCategoryMutation>;
export type CreateCategoryMutationOptions = Apollo.BaseMutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = gql`
    mutation UpdateCategory($input: UpdateCategoryInput!) {
  updateCategory(input: $input)
}
    `;
export type UpdateCategoryMutationFn = Apollo.MutationFunction<UpdateCategoryMutation, UpdateCategoryMutationVariables>;

/**
 * __useUpdateCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCategoryMutation, { data, loading, error }] = useUpdateCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UpdateCategoryDocument, options);
      }
export type UpdateCategoryMutationHookResult = ReturnType<typeof useUpdateCategoryMutation>;
export type UpdateCategoryMutationResult = Apollo.MutationResult<UpdateCategoryMutation>;
export type UpdateCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const DeleteCategoryDocument = gql`
    mutation DeleteCategory($id: Int!) {
  deleteCategory(id: $id)
}
    `;
export type DeleteCategoryMutationFn = Apollo.MutationFunction<DeleteCategoryMutation, DeleteCategoryMutationVariables>;

/**
 * __useDeleteCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCategoryMutation, { data, loading, error }] = useDeleteCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCategoryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCategoryMutation, DeleteCategoryMutationVariables>(DeleteCategoryDocument, options);
      }
export type DeleteCategoryMutationHookResult = ReturnType<typeof useDeleteCategoryMutation>;
export type DeleteCategoryMutationResult = Apollo.MutationResult<DeleteCategoryMutation>;
export type DeleteCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const GetAllCompaniesDocument = gql`
    query GetAllCompanies {
  companies {
    id
    name
  }
}
    `;

/**
 * __useGetAllCompaniesQuery__
 *
 * To run a query within a React component, call `useGetAllCompaniesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCompaniesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCompaniesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllCompaniesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllCompaniesQuery, GetAllCompaniesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllCompaniesQuery, GetAllCompaniesQueryVariables>(GetAllCompaniesDocument, options);
      }
export function useGetAllCompaniesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCompaniesQuery, GetAllCompaniesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllCompaniesQuery, GetAllCompaniesQueryVariables>(GetAllCompaniesDocument, options);
        }
export type GetAllCompaniesQueryHookResult = ReturnType<typeof useGetAllCompaniesQuery>;
export type GetAllCompaniesLazyQueryHookResult = ReturnType<typeof useGetAllCompaniesLazyQuery>;
export type GetAllCompaniesQueryResult = Apollo.QueryResult<GetAllCompaniesQuery, GetAllCompaniesQueryVariables>;
export const CreateCompanyDocument = gql`
    mutation CreateCompany($input: CreateCompanyInput!) {
  createCompany(input: $input)
}
    `;
export type CreateCompanyMutationFn = Apollo.MutationFunction<CreateCompanyMutation, CreateCompanyMutationVariables>;

/**
 * __useCreateCompanyMutation__
 *
 * To run a mutation, you first call `useCreateCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCompanyMutation, { data, loading, error }] = useCreateCompanyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCompanyMutation(baseOptions?: Apollo.MutationHookOptions<CreateCompanyMutation, CreateCompanyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCompanyMutation, CreateCompanyMutationVariables>(CreateCompanyDocument, options);
      }
export type CreateCompanyMutationHookResult = ReturnType<typeof useCreateCompanyMutation>;
export type CreateCompanyMutationResult = Apollo.MutationResult<CreateCompanyMutation>;
export type CreateCompanyMutationOptions = Apollo.BaseMutationOptions<CreateCompanyMutation, CreateCompanyMutationVariables>;
export const UpdateCompanyDocument = gql`
    mutation UpdateCompany($input: UpdateCompanyInput!) {
  updateCompany(input: $input)
}
    `;
export type UpdateCompanyMutationFn = Apollo.MutationFunction<UpdateCompanyMutation, UpdateCompanyMutationVariables>;

/**
 * __useUpdateCompanyMutation__
 *
 * To run a mutation, you first call `useUpdateCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCompanyMutation, { data, loading, error }] = useUpdateCompanyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCompanyMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCompanyMutation, UpdateCompanyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCompanyMutation, UpdateCompanyMutationVariables>(UpdateCompanyDocument, options);
      }
export type UpdateCompanyMutationHookResult = ReturnType<typeof useUpdateCompanyMutation>;
export type UpdateCompanyMutationResult = Apollo.MutationResult<UpdateCompanyMutation>;
export type UpdateCompanyMutationOptions = Apollo.BaseMutationOptions<UpdateCompanyMutation, UpdateCompanyMutationVariables>;
export const DeleteCompanyDocument = gql`
    mutation DeleteCompany($id: Int!) {
  deleteCompany(id: $id)
}
    `;
export type DeleteCompanyMutationFn = Apollo.MutationFunction<DeleteCompanyMutation, DeleteCompanyMutationVariables>;

/**
 * __useDeleteCompanyMutation__
 *
 * To run a mutation, you first call `useDeleteCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCompanyMutation, { data, loading, error }] = useDeleteCompanyMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCompanyMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCompanyMutation, DeleteCompanyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCompanyMutation, DeleteCompanyMutationVariables>(DeleteCompanyDocument, options);
      }
export type DeleteCompanyMutationHookResult = ReturnType<typeof useDeleteCompanyMutation>;
export type DeleteCompanyMutationResult = Apollo.MutationResult<DeleteCompanyMutation>;
export type DeleteCompanyMutationOptions = Apollo.BaseMutationOptions<DeleteCompanyMutation, DeleteCompanyMutationVariables>;
export const GetAllOrdersDocument = gql`
    query GetAllOrders {
  orders {
    id
    status
    user_id
    buyer_name
    buyer_email
    buyer_phone
    delivery_address
    shipping_cost
    created_at
    order_items {
      amount
      price
      product {
        id
        name
        price
        discount
      }
    }
  }
}
    `;

/**
 * __useGetAllOrdersQuery__
 *
 * To run a query within a React component, call `useGetAllOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllOrdersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllOrdersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllOrdersQuery, GetAllOrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllOrdersQuery, GetAllOrdersQueryVariables>(GetAllOrdersDocument, options);
      }
export function useGetAllOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllOrdersQuery, GetAllOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllOrdersQuery, GetAllOrdersQueryVariables>(GetAllOrdersDocument, options);
        }
export type GetAllOrdersQueryHookResult = ReturnType<typeof useGetAllOrdersQuery>;
export type GetAllOrdersLazyQueryHookResult = ReturnType<typeof useGetAllOrdersLazyQuery>;
export type GetAllOrdersQueryResult = Apollo.QueryResult<GetAllOrdersQuery, GetAllOrdersQueryVariables>;
export const CancelOrderDocument = gql`
    mutation CancelOrder($id: Int!) {
  cancelOrder(id: $id)
}
    `;
export type CancelOrderMutationFn = Apollo.MutationFunction<CancelOrderMutation, CancelOrderMutationVariables>;

/**
 * __useCancelOrderMutation__
 *
 * To run a mutation, you first call `useCancelOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelOrderMutation, { data, loading, error }] = useCancelOrderMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCancelOrderMutation(baseOptions?: Apollo.MutationHookOptions<CancelOrderMutation, CancelOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelOrderMutation, CancelOrderMutationVariables>(CancelOrderDocument, options);
      }
export type CancelOrderMutationHookResult = ReturnType<typeof useCancelOrderMutation>;
export type CancelOrderMutationResult = Apollo.MutationResult<CancelOrderMutation>;
export type CancelOrderMutationOptions = Apollo.BaseMutationOptions<CancelOrderMutation, CancelOrderMutationVariables>;
export const GetSearchResultsDocument = gql`
    query GetSearchResults($input: String!) {
  searchBarQuery(input: $input) {
    categories {
      id
      name
    }
    companies {
      id
      name
    }
    products {
      id
      name
    }
  }
}
    `;

/**
 * __useGetSearchResultsQuery__
 *
 * To run a query within a React component, call `useGetSearchResultsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSearchResultsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSearchResultsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetSearchResultsQuery(baseOptions: Apollo.QueryHookOptions<GetSearchResultsQuery, GetSearchResultsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSearchResultsQuery, GetSearchResultsQueryVariables>(GetSearchResultsDocument, options);
      }
export function useGetSearchResultsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSearchResultsQuery, GetSearchResultsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSearchResultsQuery, GetSearchResultsQueryVariables>(GetSearchResultsDocument, options);
        }
export type GetSearchResultsQueryHookResult = ReturnType<typeof useGetSearchResultsQuery>;
export type GetSearchResultsLazyQueryHookResult = ReturnType<typeof useGetSearchResultsLazyQuery>;
export type GetSearchResultsQueryResult = Apollo.QueryResult<GetSearchResultsQuery, GetSearchResultsQueryVariables>;
export const GetAllProductsDocument = gql`
    query GetAllProducts {
  products {
    id
    name
    price
    description
    company {
      id
      name
    }
    category {
      id
      name
      parent_id
    }
    inventory
    shipping_cost
    discount
    images {
      img_src
    }
    variants {
      id
    }
  }
}
    `;

/**
 * __useGetAllProductsQuery__
 *
 * To run a query within a React component, call `useGetAllProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllProductsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllProductsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllProductsQuery, GetAllProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllProductsQuery, GetAllProductsQueryVariables>(GetAllProductsDocument, options);
      }
export function useGetAllProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllProductsQuery, GetAllProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllProductsQuery, GetAllProductsQueryVariables>(GetAllProductsDocument, options);
        }
export type GetAllProductsQueryHookResult = ReturnType<typeof useGetAllProductsQuery>;
export type GetAllProductsLazyQueryHookResult = ReturnType<typeof useGetAllProductsLazyQuery>;
export type GetAllProductsQueryResult = Apollo.QueryResult<GetAllProductsQuery, GetAllProductsQueryVariables>;
export const GetProductsByIdDocument = gql`
    query GetProductsById($ids: [Int!]!) {
  productsById(ids: $ids) {
    id
    name
    price
    inventory
    shipping_cost
    discount
    images {
      img_src
    }
  }
}
    `;

/**
 * __useGetProductsByIdQuery__
 *
 * To run a query within a React component, call `useGetProductsByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductsByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductsByIdQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useGetProductsByIdQuery(baseOptions: Apollo.QueryHookOptions<GetProductsByIdQuery, GetProductsByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProductsByIdQuery, GetProductsByIdQueryVariables>(GetProductsByIdDocument, options);
      }
export function useGetProductsByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductsByIdQuery, GetProductsByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProductsByIdQuery, GetProductsByIdQueryVariables>(GetProductsByIdDocument, options);
        }
export type GetProductsByIdQueryHookResult = ReturnType<typeof useGetProductsByIdQuery>;
export type GetProductsByIdLazyQueryHookResult = ReturnType<typeof useGetProductsByIdLazyQuery>;
export type GetProductsByIdQueryResult = Apollo.QueryResult<GetProductsByIdQuery, GetProductsByIdQueryVariables>;
export const GetFilteredProductsDocument = gql`
    query GetFilteredProducts($limit: Int!, $offset: Int!, $input: QueryProductInput!) {
  filteredProducts(limit: $limit, offset: $offset, input: $input) {
    id
    name
    price
    inventory
    discount
    images {
      img_src
    }
    company {
      id
      name
    }
    _count {
      orders
    }
  }
}
    `;

/**
 * __useGetFilteredProductsQuery__
 *
 * To run a query within a React component, call `useGetFilteredProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFilteredProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFilteredProductsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetFilteredProductsQuery(baseOptions: Apollo.QueryHookOptions<GetFilteredProductsQuery, GetFilteredProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFilteredProductsQuery, GetFilteredProductsQueryVariables>(GetFilteredProductsDocument, options);
      }
export function useGetFilteredProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFilteredProductsQuery, GetFilteredProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFilteredProductsQuery, GetFilteredProductsQueryVariables>(GetFilteredProductsDocument, options);
        }
export type GetFilteredProductsQueryHookResult = ReturnType<typeof useGetFilteredProductsQuery>;
export type GetFilteredProductsLazyQueryHookResult = ReturnType<typeof useGetFilteredProductsLazyQuery>;
export type GetFilteredProductsQueryResult = Apollo.QueryResult<GetFilteredProductsQuery, GetFilteredProductsQueryVariables>;
export const GetSearchDataDocument = gql`
    query GetSearchData($input: QuerySearchDataInput!) {
  searchData(input: $input) {
    min
    max
    categories {
      id
      name
      parent_id
      productCount
    }
    companies {
      id
      name
      productCount
    }
  }
}
    `;

/**
 * __useGetSearchDataQuery__
 *
 * To run a query within a React component, call `useGetSearchDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSearchDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSearchDataQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetSearchDataQuery(baseOptions: Apollo.QueryHookOptions<GetSearchDataQuery, GetSearchDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSearchDataQuery, GetSearchDataQueryVariables>(GetSearchDataDocument, options);
      }
export function useGetSearchDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSearchDataQuery, GetSearchDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSearchDataQuery, GetSearchDataQueryVariables>(GetSearchDataDocument, options);
        }
export type GetSearchDataQueryHookResult = ReturnType<typeof useGetSearchDataQuery>;
export type GetSearchDataLazyQueryHookResult = ReturnType<typeof useGetSearchDataLazyQuery>;
export type GetSearchDataQueryResult = Apollo.QueryResult<GetSearchDataQuery, GetSearchDataQueryVariables>;
export const GetFeaturedProductsDocument = gql`
    query GetFeaturedProducts($limit: Int!, $offset: Int!) {
  featuredProducts(limit: $limit, offset: $offset) {
    id
    name
    price
    inventory
    discount
    images {
      img_src
    }
  }
}
    `;

/**
 * __useGetFeaturedProductsQuery__
 *
 * To run a query within a React component, call `useGetFeaturedProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFeaturedProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFeaturedProductsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetFeaturedProductsQuery(baseOptions: Apollo.QueryHookOptions<GetFeaturedProductsQuery, GetFeaturedProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFeaturedProductsQuery, GetFeaturedProductsQueryVariables>(GetFeaturedProductsDocument, options);
      }
export function useGetFeaturedProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFeaturedProductsQuery, GetFeaturedProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFeaturedProductsQuery, GetFeaturedProductsQueryVariables>(GetFeaturedProductsDocument, options);
        }
export type GetFeaturedProductsQueryHookResult = ReturnType<typeof useGetFeaturedProductsQuery>;
export type GetFeaturedProductsLazyQueryHookResult = ReturnType<typeof useGetFeaturedProductsLazyQuery>;
export type GetFeaturedProductsQueryResult = Apollo.QueryResult<GetFeaturedProductsQuery, GetFeaturedProductsQueryVariables>;
export const GetPopularProductsDocument = gql`
    query GetPopularProducts($limit: Int!, $offset: Int!) {
  popularProducts(limit: $limit, offset: $offset) {
    id
    name
    price
    inventory
    discount
    images {
      img_src
    }
  }
}
    `;

/**
 * __useGetPopularProductsQuery__
 *
 * To run a query within a React component, call `useGetPopularProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPopularProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPopularProductsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetPopularProductsQuery(baseOptions: Apollo.QueryHookOptions<GetPopularProductsQuery, GetPopularProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPopularProductsQuery, GetPopularProductsQueryVariables>(GetPopularProductsDocument, options);
      }
export function useGetPopularProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPopularProductsQuery, GetPopularProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPopularProductsQuery, GetPopularProductsQueryVariables>(GetPopularProductsDocument, options);
        }
export type GetPopularProductsQueryHookResult = ReturnType<typeof useGetPopularProductsQuery>;
export type GetPopularProductsLazyQueryHookResult = ReturnType<typeof useGetPopularProductsLazyQuery>;
export type GetPopularProductsQueryResult = Apollo.QueryResult<GetPopularProductsQuery, GetPopularProductsQueryVariables>;
export const GetRelatedProductsDocument = gql`
    query GetRelatedProducts($limit: Int!, $offset: Int!, $input: QueryRelatedInput!) {
  relatedProducts(limit: $limit, offset: $offset, input: $input) {
    id
    name
    price
    inventory
    discount
    images {
      img_src
    }
  }
}
    `;

/**
 * __useGetRelatedProductsQuery__
 *
 * To run a query within a React component, call `useGetRelatedProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRelatedProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRelatedProductsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetRelatedProductsQuery(baseOptions: Apollo.QueryHookOptions<GetRelatedProductsQuery, GetRelatedProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRelatedProductsQuery, GetRelatedProductsQueryVariables>(GetRelatedProductsDocument, options);
      }
export function useGetRelatedProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRelatedProductsQuery, GetRelatedProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRelatedProductsQuery, GetRelatedProductsQueryVariables>(GetRelatedProductsDocument, options);
        }
export type GetRelatedProductsQueryHookResult = ReturnType<typeof useGetRelatedProductsQuery>;
export type GetRelatedProductsLazyQueryHookResult = ReturnType<typeof useGetRelatedProductsLazyQuery>;
export type GetRelatedProductsQueryResult = Apollo.QueryResult<GetRelatedProductsQuery, GetRelatedProductsQueryVariables>;
export const GetSingleProductDocument = gql`
    query GetSingleProduct($id: Int!) {
  product(id: $id) {
    id
    name
    price
    description
    company {
      id
      name
    }
    category {
      id
      name
    }
    inventory
    shipping_cost
    discount
    images {
      img_id
      img_src
    }
    variants {
      id
      name
      images {
        img_src
      }
    }
  }
}
    `;

/**
 * __useGetSingleProductQuery__
 *
 * To run a query within a React component, call `useGetSingleProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSingleProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSingleProductQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSingleProductQuery(baseOptions: Apollo.QueryHookOptions<GetSingleProductQuery, GetSingleProductQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSingleProductQuery, GetSingleProductQueryVariables>(GetSingleProductDocument, options);
      }
export function useGetSingleProductLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSingleProductQuery, GetSingleProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSingleProductQuery, GetSingleProductQueryVariables>(GetSingleProductDocument, options);
        }
export type GetSingleProductQueryHookResult = ReturnType<typeof useGetSingleProductQuery>;
export type GetSingleProductLazyQueryHookResult = ReturnType<typeof useGetSingleProductLazyQuery>;
export type GetSingleProductQueryResult = Apollo.QueryResult<GetSingleProductQuery, GetSingleProductQueryVariables>;
export const CreateProductDocument = gql`
    mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input)
}
    `;
export type CreateProductMutationFn = Apollo.MutationFunction<CreateProductMutation, CreateProductMutationVariables>;

/**
 * __useCreateProductMutation__
 *
 * To run a mutation, you first call `useCreateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductMutation, { data, loading, error }] = useCreateProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProductMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductMutation, CreateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, options);
      }
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = Apollo.MutationResult<CreateProductMutation>;
export type CreateProductMutationOptions = Apollo.BaseMutationOptions<CreateProductMutation, CreateProductMutationVariables>;
export const UpdateProductDocument = gql`
    mutation UpdateProduct($input: UpdateProductInput!) {
  updateProduct(input: $input)
}
    `;
export type UpdateProductMutationFn = Apollo.MutationFunction<UpdateProductMutation, UpdateProductMutationVariables>;

/**
 * __useUpdateProductMutation__
 *
 * To run a mutation, you first call `useUpdateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductMutation, { data, loading, error }] = useUpdateProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductMutation, UpdateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument, options);
      }
export type UpdateProductMutationHookResult = ReturnType<typeof useUpdateProductMutation>;
export type UpdateProductMutationResult = Apollo.MutationResult<UpdateProductMutation>;
export type UpdateProductMutationOptions = Apollo.BaseMutationOptions<UpdateProductMutation, UpdateProductMutationVariables>;
export const DeleteProductDocument = gql`
    mutation DeleteProduct($id: Int!) {
  deleteProduct(id: $id)
}
    `;
export type DeleteProductMutationFn = Apollo.MutationFunction<DeleteProductMutation, DeleteProductMutationVariables>;

/**
 * __useDeleteProductMutation__
 *
 * To run a mutation, you first call `useDeleteProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductMutation, { data, loading, error }] = useDeleteProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProductMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductMutation, DeleteProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument, options);
      }
export type DeleteProductMutationHookResult = ReturnType<typeof useDeleteProductMutation>;
export type DeleteProductMutationResult = Apollo.MutationResult<DeleteProductMutation>;
export type DeleteProductMutationOptions = Apollo.BaseMutationOptions<DeleteProductMutation, DeleteProductMutationVariables>;
export const ShowCurrentUserDocument = gql`
    query ShowCurrentUser {
  showMe {
    id
    given_name
    family_name
    email
    address
    phone
    avatar
    role
    csrfToken
  }
}
    `;

/**
 * __useShowCurrentUserQuery__
 *
 * To run a query within a React component, call `useShowCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useShowCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShowCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useShowCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<ShowCurrentUserQuery, ShowCurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ShowCurrentUserQuery, ShowCurrentUserQueryVariables>(ShowCurrentUserDocument, options);
      }
export function useShowCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ShowCurrentUserQuery, ShowCurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ShowCurrentUserQuery, ShowCurrentUserQueryVariables>(ShowCurrentUserDocument, options);
        }
export type ShowCurrentUserQueryHookResult = ReturnType<typeof useShowCurrentUserQuery>;
export type ShowCurrentUserLazyQueryHookResult = ReturnType<typeof useShowCurrentUserLazyQuery>;
export type ShowCurrentUserQueryResult = Apollo.QueryResult<ShowCurrentUserQuery, ShowCurrentUserQueryVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input)
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;