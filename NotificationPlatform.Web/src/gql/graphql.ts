/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `Date` scalar represents an ISO-8601 compliant date type. */
  Date: { input: any; output: any; }
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

export type AddEmailTransportInput = {
  emailConfigurationId: Scalars['UUID']['input'];
  host: Scalars['String']['input'];
  password: Scalars['String']['input'];
  port: Scalars['Int']['input'];
  senderAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  user: Scalars['String']['input'];
};

export type AddEmailTransportPayload = {
  __typename?: 'AddEmailTransportPayload';
  emailTransport?: Maybe<Array<EmailTransport>>;
};

export type AddEmailTransportSenderAddressInput = {
  address: Scalars['String']['input'];
  emailTransportId: Scalars['UUID']['input'];
};

export type AddEmailTransportSenderAddressPayload = {
  __typename?: 'AddEmailTransportSenderAddressPayload';
  emailTransportSenderAddress?: Maybe<Array<EmailTransportSenderAddress>>;
};

/** Defines when a policy shall be executed. */
export enum ApplyPolicy {
  /** After the resolver was executed. */
  AfterResolver = 'AFTER_RESOLVER',
  /** Before the resolver was executed. */
  BeforeResolver = 'BEFORE_RESOLVER',
  /** The policy is applied in the validation step before the execution. */
  Validation = 'VALIDATION'
}

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  neq?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DateTimeOperationFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  neq?: InputMaybe<Scalars['DateTime']['input']>;
  ngt?: InputMaybe<Scalars['DateTime']['input']>;
  ngte?: InputMaybe<Scalars['DateTime']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  nlt?: InputMaybe<Scalars['DateTime']['input']>;
  nlte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type EmailConfiguration = {
  __typename?: 'EmailConfiguration';
  id: Scalars['UUID']['output'];
  project: Project;
  projectId: Scalars['UUID']['output'];
  properties: Array<EmailContactProperty>;
  transports: Array<EmailTransport>;
};


export type EmailConfigurationPropertiesArgs = {
  order?: InputMaybe<Array<EmailContactPropertySortInput>>;
  where?: InputMaybe<EmailContactPropertyFilterInput>;
};


export type EmailConfigurationTransportsArgs = {
  order?: InputMaybe<Array<EmailTransportSortInput>>;
  where?: InputMaybe<EmailTransportFilterInput>;
};

export type EmailConfigurationFilterInput = {
  and?: InputMaybe<Array<EmailConfigurationFilterInput>>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<EmailConfigurationFilterInput>>;
  project?: InputMaybe<ProjectFilterInput>;
  projectId?: InputMaybe<UuidOperationFilterInput>;
  properties?: InputMaybe<ListFilterInputTypeOfEmailContactPropertyFilterInput>;
  transports?: InputMaybe<ListFilterInputTypeOfEmailTransportFilterInput>;
};

export type EmailConfigurationSortInput = {
  id?: InputMaybe<SortEnumType>;
  project?: InputMaybe<ProjectSortInput>;
  projectId?: InputMaybe<SortEnumType>;
};

export type EmailContact = {
  __typename?: 'EmailContact';
  createdAt: Scalars['DateTime']['output'];
  emailAddress: Scalars['String']['output'];
  emailConfiguration: EmailConfiguration;
  emailConfigurationId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  properties: Array<EmailContactPropertyValue>;
};

export type EmailContactChoiceProperty = EmailContactProperty & {
  __typename?: 'EmailContactChoiceProperty';
  choices: Array<Scalars['String']['output']>;
  emailConfiguration: EmailConfiguration;
  emailConfigurationId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  show: Scalars['Boolean']['output'];
  values: Array<EmailContactPropertyValue>;
};

export type EmailContactChoicePropertyValue = EmailContactPropertyValue & {
  __typename?: 'EmailContactChoicePropertyValue';
  contact: EmailContact;
  contactId: Scalars['UUID']['output'];
  property: EmailContactChoiceProperty;
  propertyId: Scalars['UUID']['output'];
  value: Scalars['String']['output'];
};

export type EmailContactDateProperty = EmailContactProperty & {
  __typename?: 'EmailContactDateProperty';
  emailConfiguration: EmailConfiguration;
  emailConfigurationId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  show: Scalars['Boolean']['output'];
  values: Array<EmailContactPropertyValue>;
};

export type EmailContactDatePropertyValue = EmailContactPropertyValue & {
  __typename?: 'EmailContactDatePropertyValue';
  contact: EmailContact;
  contactId: Scalars['UUID']['output'];
  property: EmailContactDateProperty;
  propertyId: Scalars['UUID']['output'];
  value: Scalars['Date']['output'];
};

export type EmailContactFilterInput = {
  and?: InputMaybe<Array<EmailContactFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  emailAddress?: InputMaybe<StringOperationFilterInput>;
  emailConfiguration?: InputMaybe<EmailConfigurationFilterInput>;
  emailConfigurationId?: InputMaybe<UuidOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<EmailContactFilterInput>>;
  properties?: InputMaybe<ListFilterInputTypeOfEmailContactPropertyValueFilterInput>;
};

export type EmailContactNumberProperty = EmailContactProperty & {
  __typename?: 'EmailContactNumberProperty';
  emailConfiguration: EmailConfiguration;
  emailConfigurationId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  show: Scalars['Boolean']['output'];
  values: Array<EmailContactPropertyValue>;
};

export type EmailContactNumberPropertyValue = EmailContactPropertyValue & {
  __typename?: 'EmailContactNumberPropertyValue';
  contact: EmailContact;
  contactId: Scalars['UUID']['output'];
  property: EmailContactNumberProperty;
  propertyId: Scalars['UUID']['output'];
  value: Scalars['Float']['output'];
};

export type EmailContactProperty = {
  emailConfiguration: EmailConfiguration;
  emailConfigurationId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  show: Scalars['Boolean']['output'];
  values: Array<EmailContactPropertyValue>;
};

export type EmailContactPropertyFilterInput = {
  and?: InputMaybe<Array<EmailContactPropertyFilterInput>>;
  emailConfiguration?: InputMaybe<EmailConfigurationFilterInput>;
  emailConfigurationId?: InputMaybe<UuidOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<EmailContactPropertyFilterInput>>;
  show?: InputMaybe<BooleanOperationFilterInput>;
  values?: InputMaybe<ListFilterInputTypeOfEmailContactPropertyValueFilterInput>;
};

export type EmailContactPropertySortInput = {
  emailConfiguration?: InputMaybe<EmailConfigurationSortInput>;
  emailConfigurationId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  show?: InputMaybe<SortEnumType>;
};

export type EmailContactPropertyValue = {
  contact: EmailContact;
  contactId: Scalars['UUID']['output'];
  property: EmailContactProperty;
  propertyId: Scalars['UUID']['output'];
};

export type EmailContactPropertyValueFilterInput = {
  and?: InputMaybe<Array<EmailContactPropertyValueFilterInput>>;
  contact?: InputMaybe<EmailContactFilterInput>;
  contactId?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<EmailContactPropertyValueFilterInput>>;
  property?: InputMaybe<EmailContactPropertyFilterInput>;
  propertyId?: InputMaybe<UuidOperationFilterInput>;
};

export type EmailContactStringProperty = EmailContactProperty & {
  __typename?: 'EmailContactStringProperty';
  emailConfiguration: EmailConfiguration;
  emailConfigurationId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  show: Scalars['Boolean']['output'];
  values: Array<EmailContactPropertyValue>;
};

export type EmailContactStringPropertyValue = EmailContactPropertyValue & {
  __typename?: 'EmailContactStringPropertyValue';
  contact: EmailContact;
  contactId: Scalars['UUID']['output'];
  property: EmailContactStringProperty;
  propertyId: Scalars['UUID']['output'];
  value: Scalars['String']['output'];
};

/** A connection to a list of items. */
export type EmailContactsConnection = {
  __typename?: 'EmailContactsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<EmailContactsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<EmailContact>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type EmailContactsEdge = {
  __typename?: 'EmailContactsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: EmailContact;
};

export type EmailTransport = {
  __typename?: 'EmailTransport';
  emailConfiguration: EmailConfiguration;
  emailConfigurationId: Scalars['UUID']['output'];
  host: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  port: Scalars['Int']['output'];
  senderAddresses: Array<EmailTransportSenderAddress>;
  user: Scalars['String']['output'];
};


export type EmailTransportSenderAddressesArgs = {
  order?: InputMaybe<Array<EmailTransportSenderAddressSortInput>>;
  where?: InputMaybe<EmailTransportSenderAddressFilterInput>;
};

export type EmailTransportFilterInput = {
  and?: InputMaybe<Array<EmailTransportFilterInput>>;
  emailConfiguration?: InputMaybe<EmailConfigurationFilterInput>;
  emailConfigurationId?: InputMaybe<UuidOperationFilterInput>;
  host?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<EmailTransportFilterInput>>;
  port?: InputMaybe<IntOperationFilterInput>;
  senderAddresses?: InputMaybe<ListFilterInputTypeOfEmailTransportSenderAddressFilterInput>;
  user?: InputMaybe<StringOperationFilterInput>;
};

export type EmailTransportSenderAddress = {
  __typename?: 'EmailTransportSenderAddress';
  address: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  transport: EmailTransport;
  transportId: Scalars['UUID']['output'];
};

export type EmailTransportSenderAddressFilterInput = {
  address?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<EmailTransportSenderAddressFilterInput>>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<EmailTransportSenderAddressFilterInput>>;
  transport?: InputMaybe<EmailTransportFilterInput>;
  transportId?: InputMaybe<UuidOperationFilterInput>;
};

export type EmailTransportSenderAddressSortInput = {
  address?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  transport?: InputMaybe<EmailTransportSortInput>;
  transportId?: InputMaybe<SortEnumType>;
};

export type EmailTransportSortInput = {
  emailConfiguration?: InputMaybe<EmailConfigurationSortInput>;
  emailConfigurationId?: InputMaybe<SortEnumType>;
  host?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  port?: InputMaybe<SortEnumType>;
  user?: InputMaybe<SortEnumType>;
};

export type IntOperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
  ngt?: InputMaybe<Scalars['Int']['input']>;
  ngte?: InputMaybe<Scalars['Int']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  nlt?: InputMaybe<Scalars['Int']['input']>;
  nlte?: InputMaybe<Scalars['Int']['input']>;
};

export type ListFilterInputTypeOfEmailContactPropertyFilterInput = {
  all?: InputMaybe<EmailContactPropertyFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<EmailContactPropertyFilterInput>;
  some?: InputMaybe<EmailContactPropertyFilterInput>;
};

export type ListFilterInputTypeOfEmailContactPropertyValueFilterInput = {
  all?: InputMaybe<EmailContactPropertyValueFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<EmailContactPropertyValueFilterInput>;
  some?: InputMaybe<EmailContactPropertyValueFilterInput>;
};

export type ListFilterInputTypeOfEmailTransportFilterInput = {
  all?: InputMaybe<EmailTransportFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<EmailTransportFilterInput>;
  some?: InputMaybe<EmailTransportFilterInput>;
};

export type ListFilterInputTypeOfEmailTransportSenderAddressFilterInput = {
  all?: InputMaybe<EmailTransportSenderAddressFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<EmailTransportSenderAddressFilterInput>;
  some?: InputMaybe<EmailTransportSenderAddressFilterInput>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addEmailTransport: AddEmailTransportPayload;
  addEmailTransportSenderAddress: AddEmailTransportSenderAddressPayload;
  updateProject: UpdateProjectPayload;
};


export type MutationAddEmailTransportArgs = {
  input: AddEmailTransportInput;
};


export type MutationAddEmailTransportSenderAddressArgs = {
  input: AddEmailTransportSenderAddressInput;
};


export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** Indicates whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean']['output'];
  /** Indicates whether more edges exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Project = {
  __typename?: 'Project';
  emailConfiguration?: Maybe<EmailConfiguration>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
};

export type ProjectFilterInput = {
  and?: InputMaybe<Array<ProjectFilterInput>>;
  emailConfiguration?: InputMaybe<EmailConfigurationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ProjectFilterInput>>;
};

export type ProjectSortInput = {
  emailConfiguration?: InputMaybe<EmailConfigurationSortInput>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
};

export type Query = {
  __typename?: 'Query';
  emailConfiguration?: Maybe<EmailConfiguration>;
  emailContacts?: Maybe<EmailContactsConnection>;
  project?: Maybe<Project>;
  projects: Array<Project>;
};


export type QueryEmailConfigurationArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryEmailContactsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  emailConfigurationId: Scalars['UUID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<EmailContactFilterInput>;
};


export type QueryProjectArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryProjectsArgs = {
  where?: InputMaybe<ProjectFilterInput>;
};

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ncontains?: InputMaybe<Scalars['String']['input']>;
  nendsWith?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nstartsWith?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProjectInput = {
  id: Scalars['UUID']['input'];
  name: Scalars['String']['input'];
};

export type UpdateProjectPayload = {
  __typename?: 'UpdateProjectPayload';
  project?: Maybe<Array<Project>>;
};

export type UuidOperationFilterInput = {
  eq?: InputMaybe<Scalars['UUID']['input']>;
  gt?: InputMaybe<Scalars['UUID']['input']>;
  gte?: InputMaybe<Scalars['UUID']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  lt?: InputMaybe<Scalars['UUID']['input']>;
  lte?: InputMaybe<Scalars['UUID']['input']>;
  neq?: InputMaybe<Scalars['UUID']['input']>;
  ngt?: InputMaybe<Scalars['UUID']['input']>;
  ngte?: InputMaybe<Scalars['UUID']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  nlt?: InputMaybe<Scalars['UUID']['input']>;
  nlte?: InputMaybe<Scalars['UUID']['input']>;
};

export type AllProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllProjectsQuery = { __typename?: 'Query', projects: Array<{ __typename?: 'Project', id: any, name: string }> };


export const AllProjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allProjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AllProjectsQuery, AllProjectsQueryVariables>;