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

export type GetAllCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCategoriesQuery = { __typename?: 'Query', categories?: Array<{ __typename?: 'Category', id: string, name: string, parent_id?: number | null }> | null };

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'Category', name: string, parent_id?: number | null } };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory?: boolean | null };

export type GetAllProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllProductsQuery = { __typename?: 'Query', products?: Array<{ __typename?: 'Product', id: string, name: string, price: number, description: any, company: string, inventory: number, shipping_cost: number, discount: number, avg_rating: number, num_of_reviews: number, images: Array<string | null> } | null> | null };

export type GetSingleUserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetSingleUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, role: Role } | null };

export type ShowCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type ShowCurrentUserQuery = { __typename?: 'Query', showMe?: { __typename?: 'User', id: string, given_name: string, family_name: string, role: Role, avatar: string } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };


export const GetAllCategoriesDocument = gql`
    query GetAllCategories {
  categories {
    id
    name
    parent_id
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
  createCategory(input: $input) {
    name
    parent_id
  }
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
export const DeleteCategoryDocument = gql`
    mutation DeleteCategory($id: ID!) {
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
export const GetAllProductsDocument = gql`
    query GetAllProducts {
  products {
    id
    name
    price
    description
    company
    inventory
    shipping_cost
    discount
    avg_rating
    num_of_reviews
    images
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
export const GetSingleUserDocument = gql`
    query GetSingleUser($id: ID!) {
  user(id: $id) {
    id
    role
  }
}
    `;

/**
 * __useGetSingleUserQuery__
 *
 * To run a query within a React component, call `useGetSingleUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSingleUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSingleUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSingleUserQuery(baseOptions: Apollo.QueryHookOptions<GetSingleUserQuery, GetSingleUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSingleUserQuery, GetSingleUserQueryVariables>(GetSingleUserDocument, options);
      }
export function useGetSingleUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSingleUserQuery, GetSingleUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSingleUserQuery, GetSingleUserQueryVariables>(GetSingleUserDocument, options);
        }
export type GetSingleUserQueryHookResult = ReturnType<typeof useGetSingleUserQuery>;
export type GetSingleUserLazyQueryHookResult = ReturnType<typeof useGetSingleUserLazyQuery>;
export type GetSingleUserQueryResult = Apollo.QueryResult<GetSingleUserQuery, GetSingleUserQueryVariables>;
export const ShowCurrentUserDocument = gql`
    query ShowCurrentUser {
  showMe {
    id
    given_name
    family_name
    role
    avatar
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
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;