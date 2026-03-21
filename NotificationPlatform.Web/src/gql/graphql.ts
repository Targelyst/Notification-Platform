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
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: { input: any; output: any; }
  /** The EmailAddress scalar type constitutes a valid email address, represented as a UTF-8 character sequence. The scalar follows the specification defined by the HTML Spec https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address. */
  EmailAddress: { input: any; output: any; }
  JSON: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

export type AddEmailContactPropertyError = InvalidArgumentError | NotFoundError;

export type AddEmailContactPropertyInput = {
  choices?: InputMaybe<Array<Scalars['String']['input']>>;
  emailConfigurationId: Scalars['UUID']['input'];
  name: Scalars['String']['input'];
  show?: InputMaybe<Scalars['Boolean']['input']>;
  type: EmailContactPropertyType;
};

export type AddEmailContactPropertyPayload = {
  __typename?: 'AddEmailContactPropertyPayload';
  emailContactProperty?: Maybe<Array<EmailContactProperty>>;
  errors?: Maybe<Array<AddEmailContactPropertyError>>;
};

export type AddEmailSegmentError = EmailSegmentExpressionValidationError;

export type AddEmailSegmentInput = {
  emailConfigurationId: Scalars['UUID']['input'];
  expression?: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
};

export type AddEmailSegmentPayload = {
  __typename?: 'AddEmailSegmentPayload';
  emailSegment?: Maybe<Array<EmailSegment>>;
  errors?: Maybe<Array<AddEmailSegmentError>>;
};

export type AddEmailTransportInput = {
  emailConfigurationId: Scalars['UUID']['input'];
  host: Scalars['String']['input'];
  password: Scalars['String']['input'];
  port: Scalars['Int']['input'];
  senderAddresses?: InputMaybe<Array<InputMaybe<Scalars['EmailAddress']['input']>>>;
  user: Scalars['String']['input'];
};

export type AddEmailTransportPayload = {
  __typename?: 'AddEmailTransportPayload';
  emailTransport?: Maybe<Array<EmailTransport>>;
};

export type AddEmailTransportSenderAddressInput = {
  address?: InputMaybe<Scalars['EmailAddress']['input']>;
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

export type BulkAddEmailContactPropertiesResult = {
  __typename?: 'BulkAddEmailContactPropertiesResult';
  insertedEntries: Scalars['Int']['output'];
};

export type BulkAddEmailContactPropertiesToContactsError = InvalidPropertyValueSpecificationError | NotFoundError;

export type BulkAddEmailContactPropertiesToContactsInput = {
  contactIds: Array<Scalars['UUID']['input']>;
  contactProperties: Array<BulkAddEmailContactPropertyDtoInput>;
};

export type BulkAddEmailContactPropertiesToContactsPayload = {
  __typename?: 'BulkAddEmailContactPropertiesToContactsPayload';
  bulkAddEmailContactPropertiesResult?: Maybe<BulkAddEmailContactPropertiesResult>;
  errors?: Maybe<Array<BulkAddEmailContactPropertiesToContactsError>>;
};

export type BulkAddEmailContactPropertiesToSegmentError = InvalidPropertyValueSpecificationError | NotFoundError;

export type BulkAddEmailContactPropertiesToSegmentInput = {
  contactProperties: Array<BulkAddEmailContactPropertyDtoInput>;
  segmentId: Scalars['UUID']['input'];
};

export type BulkAddEmailContactPropertiesToSegmentPayload = {
  __typename?: 'BulkAddEmailContactPropertiesToSegmentPayload';
  bulkAddEmailContactPropertiesResult?: Maybe<BulkAddEmailContactPropertiesResult>;
  errors?: Maybe<Array<BulkAddEmailContactPropertiesToSegmentError>>;
};

export type BulkAddEmailContactPropertyDtoInput = {
  propertyId: Scalars['UUID']['input'];
  value: Scalars['String']['input'];
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
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  project: Project;
  projectId: Scalars['UUID']['output'];
  properties: Array<EmailContactProperty>;
  segments: Array<EmailSegment>;
  transports: Array<EmailTransport>;
};


export type EmailConfigurationPropertiesArgs = {
  order?: InputMaybe<Array<EmailContactPropertySortInput>>;
  where?: InputMaybe<EmailContactPropertyFilterInput>;
};


export type EmailConfigurationSegmentsArgs = {
  where?: InputMaybe<EmailSegmentFilterInput>;
};


export type EmailConfigurationTransportsArgs = {
  order?: InputMaybe<Array<EmailTransportSortInput>>;
  where?: InputMaybe<EmailTransportFilterInput>;
};

export type EmailConfigurationFilterInput = {
  and?: InputMaybe<Array<EmailConfigurationFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<EmailConfigurationFilterInput>>;
  project?: InputMaybe<ProjectFilterInput>;
  projectId?: InputMaybe<UuidOperationFilterInput>;
  properties?: InputMaybe<ListFilterInputTypeOfEmailContactPropertyFilterInput>;
  segments?: InputMaybe<ListFilterInputTypeOfEmailSegmentFilterInput>;
  transports?: InputMaybe<ListFilterInputTypeOfEmailTransportFilterInput>;
};

export type EmailConfigurationSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
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
  createdAt: Scalars['DateTime']['output'];
  emailConfiguration: EmailConfiguration;
  emailConfigurationId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  show: Scalars['Boolean']['output'];
  values: Array<EmailContactPropertyValue>;
};

export type EmailContactDateProperty = EmailContactProperty & {
  __typename?: 'EmailContactDateProperty';
  createdAt: Scalars['DateTime']['output'];
  emailConfiguration: EmailConfiguration;
  emailConfigurationId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  show: Scalars['Boolean']['output'];
  values: Array<EmailContactPropertyValue>;
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
  createdAt: Scalars['DateTime']['output'];
  emailConfiguration: EmailConfiguration;
  emailConfigurationId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  show: Scalars['Boolean']['output'];
  values: Array<EmailContactPropertyValue>;
};

export type EmailContactProperty = {
  createdAt: Scalars['DateTime']['output'];
  emailConfiguration: EmailConfiguration;
  emailConfigurationId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  show: Scalars['Boolean']['output'];
  values: Array<EmailContactPropertyValue>;
};

export type EmailContactPropertyFilterInput = {
  and?: InputMaybe<Array<EmailContactPropertyFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  emailConfiguration?: InputMaybe<EmailConfigurationFilterInput>;
  emailConfigurationId?: InputMaybe<UuidOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<EmailContactPropertyFilterInput>>;
  show?: InputMaybe<BooleanOperationFilterInput>;
  values?: InputMaybe<ListFilterInputTypeOfEmailContactPropertyValueFilterInput>;
};

export type EmailContactPropertySortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  emailConfiguration?: InputMaybe<EmailConfigurationSortInput>;
  emailConfigurationId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  show?: InputMaybe<SortEnumType>;
};

export enum EmailContactPropertyType {
  Choice = 'CHOICE',
  Date = 'DATE',
  Number = 'NUMBER',
  String = 'STRING'
}

export type EmailContactPropertyValue = {
  __typename?: 'EmailContactPropertyValue';
  contact: EmailContact;
  contactId: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  property: EmailContactProperty;
  propertyId: Scalars['UUID']['output'];
  value: Scalars['String']['output'];
};

export type EmailContactPropertyValueFilterInput = {
  and?: InputMaybe<Array<EmailContactPropertyValueFilterInput>>;
  contact?: InputMaybe<EmailContactFilterInput>;
  contactId?: InputMaybe<UuidOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  or?: InputMaybe<Array<EmailContactPropertyValueFilterInput>>;
  property?: InputMaybe<EmailContactPropertyFilterInput>;
  propertyId?: InputMaybe<UuidOperationFilterInput>;
  value?: InputMaybe<StringOperationFilterInput>;
};

export type EmailContactStringProperty = EmailContactProperty & {
  __typename?: 'EmailContactStringProperty';
  createdAt: Scalars['DateTime']['output'];
  emailConfiguration: EmailConfiguration;
  emailConfigurationId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  show: Scalars['Boolean']['output'];
  values: Array<EmailContactPropertyValue>;
};

/** A connection to a list of items. */
export type EmailContactsBySegmentConnection = {
  __typename?: 'EmailContactsBySegmentConnection';
  /** A list of edges. */
  edges?: Maybe<Array<EmailContactsBySegmentEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<EmailContact>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type EmailContactsBySegmentEdge = {
  __typename?: 'EmailContactsBySegmentEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: EmailContact;
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

export type EmailSegment = {
  __typename?: 'EmailSegment';
  createdAt: Scalars['DateTime']['output'];
  emailConfiguration: EmailConfiguration;
  emailConfigurationId: Scalars['UUID']['output'];
  expression?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
};

export type EmailSegmentExpressionValidationError = Error & {
  __typename?: 'EmailSegmentExpressionValidationError';
  message: Scalars['String']['output'];
};

export type EmailSegmentFilterInput = {
  and?: InputMaybe<Array<EmailSegmentFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  emailConfiguration?: InputMaybe<EmailConfigurationFilterInput>;
  emailConfigurationId?: InputMaybe<UuidOperationFilterInput>;
  expression?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<EmailSegmentFilterInput>>;
};

export type EmailSegmentSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  emailConfiguration?: InputMaybe<EmailConfigurationSortInput>;
  emailConfigurationId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
};

/** A connection to a list of items. */
export type EmailSegmentsConnection = {
  __typename?: 'EmailSegmentsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<EmailSegmentsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<EmailSegment>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type EmailSegmentsEdge = {
  __typename?: 'EmailSegmentsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: EmailSegment;
};

export type EmailTransport = {
  __typename?: 'EmailTransport';
  createdAt: Scalars['DateTime']['output'];
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
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
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
  address?: Maybe<Scalars['EmailAddress']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  transport: EmailTransport;
  transportId: Scalars['UUID']['output'];
};

export type EmailTransportSenderAddressFilterInput = {
  address?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<EmailTransportSenderAddressFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<EmailTransportSenderAddressFilterInput>>;
  transport?: InputMaybe<EmailTransportFilterInput>;
  transportId?: InputMaybe<UuidOperationFilterInput>;
};

export type EmailTransportSenderAddressSortInput = {
  address?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  transport?: InputMaybe<EmailTransportSortInput>;
  transportId?: InputMaybe<SortEnumType>;
};

export type EmailTransportSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  emailConfiguration?: InputMaybe<EmailConfigurationSortInput>;
  emailConfigurationId?: InputMaybe<SortEnumType>;
  host?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  port?: InputMaybe<SortEnumType>;
  user?: InputMaybe<SortEnumType>;
};

export type Error = {
  message: Scalars['String']['output'];
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

export type InvalidArgumentError = Error & {
  __typename?: 'InvalidArgumentError';
  message: Scalars['String']['output'];
};

export type InvalidPropertyValueSpecificationError = Error & {
  __typename?: 'InvalidPropertyValueSpecificationError';
  message: Scalars['String']['output'];
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

export type ListFilterInputTypeOfEmailSegmentFilterInput = {
  all?: InputMaybe<EmailSegmentFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<EmailSegmentFilterInput>;
  some?: InputMaybe<EmailSegmentFilterInput>;
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
  addEmailContactProperty: AddEmailContactPropertyPayload;
  addEmailSegment: AddEmailSegmentPayload;
  addEmailTransport: AddEmailTransportPayload;
  addEmailTransportSenderAddress: AddEmailTransportSenderAddressPayload;
  bulkAddEmailContactPropertiesToContacts: BulkAddEmailContactPropertiesToContactsPayload;
  bulkAddEmailContactPropertiesToSegment: BulkAddEmailContactPropertiesToSegmentPayload;
  deleteEmailTransport?: Maybe<Scalars['UUID']['output']>;
  deleteEmailTransportSenderAddress?: Maybe<Scalars['UUID']['output']>;
  setEmailContactPropertyShow: SetEmailContactPropertyShowPayload;
  updateEmailContactProperty: UpdateEmailContactPropertyPayload;
  updateEmailSegment: UpdateEmailSegmentPayload;
  updateEmailTransport: UpdateEmailTransportPayload;
  updateEmailTransportSenderAddress: UpdateEmailTransportSenderAddressPayload;
  updateProject: UpdateProjectPayload;
};


export type MutationAddEmailContactPropertyArgs = {
  input: AddEmailContactPropertyInput;
};


export type MutationAddEmailSegmentArgs = {
  input: AddEmailSegmentInput;
};


export type MutationAddEmailTransportArgs = {
  input: AddEmailTransportInput;
};


export type MutationAddEmailTransportSenderAddressArgs = {
  input: AddEmailTransportSenderAddressInput;
};


export type MutationBulkAddEmailContactPropertiesToContactsArgs = {
  input: BulkAddEmailContactPropertiesToContactsInput;
};


export type MutationBulkAddEmailContactPropertiesToSegmentArgs = {
  input: BulkAddEmailContactPropertiesToSegmentInput;
};


export type MutationDeleteEmailTransportArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationDeleteEmailTransportSenderAddressArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationSetEmailContactPropertyShowArgs = {
  input: SetEmailContactPropertyShowInput;
};


export type MutationUpdateEmailContactPropertyArgs = {
  input: UpdateEmailContactPropertyInput;
};


export type MutationUpdateEmailSegmentArgs = {
  input: UpdateEmailSegmentInput;
};


export type MutationUpdateEmailTransportArgs = {
  input: UpdateEmailTransportInput;
};


export type MutationUpdateEmailTransportSenderAddressArgs = {
  input: UpdateEmailTransportSenderAddressInput;
};


export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
};

export type NotFoundError = Error & {
  __typename?: 'NotFoundError';
  message: Scalars['String']['output'];
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
  createdAt: Scalars['DateTime']['output'];
  emailConfiguration?: Maybe<EmailConfiguration>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
};

export type ProjectFilterInput = {
  and?: InputMaybe<Array<ProjectFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  emailConfiguration?: InputMaybe<EmailConfigurationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ProjectFilterInput>>;
};

export type ProjectSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  emailConfiguration?: InputMaybe<EmailConfigurationSortInput>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
};

export type Query = {
  __typename?: 'Query';
  emailConfiguration?: Maybe<EmailConfiguration>;
  emailContacts?: Maybe<EmailContactsConnection>;
  emailContactsBySegment?: Maybe<EmailContactsBySegmentConnection>;
  emailSegments?: Maybe<EmailSegmentsConnection>;
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


export type QueryEmailContactsBySegmentArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  segmentId: Scalars['UUID']['input'];
};


export type QueryEmailSegmentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  emailConfigurationId: Scalars['UUID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<EmailSegmentFilterInput>;
};


export type QueryProjectArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryProjectsArgs = {
  where?: InputMaybe<ProjectFilterInput>;
};

export type SetEmailContactPropertyShowInput = {
  id: Scalars['UUID']['input'];
  show: Scalars['Boolean']['input'];
};

export type SetEmailContactPropertyShowPayload = {
  __typename?: 'SetEmailContactPropertyShowPayload';
  emailContactProperty?: Maybe<Array<EmailContactProperty>>;
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

export type UpdateEmailContactPropertyInput = {
  choices?: InputMaybe<Array<Scalars['String']['input']>>;
  id: Scalars['UUID']['input'];
  name: Scalars['String']['input'];
  show?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateEmailContactPropertyPayload = {
  __typename?: 'UpdateEmailContactPropertyPayload';
  emailContactProperty?: Maybe<Array<EmailContactProperty>>;
};

export type UpdateEmailSegmentError = EmailSegmentExpressionValidationError;

export type UpdateEmailSegmentInput = {
  expression?: InputMaybe<Scalars['JSON']['input']>;
  id: Scalars['UUID']['input'];
  name: Scalars['String']['input'];
};

export type UpdateEmailSegmentPayload = {
  __typename?: 'UpdateEmailSegmentPayload';
  emailSegment?: Maybe<Array<EmailSegment>>;
  errors?: Maybe<Array<UpdateEmailSegmentError>>;
};

export type UpdateEmailTransportInput = {
  host: Scalars['String']['input'];
  id: Scalars['UUID']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  port: Scalars['Int']['input'];
  user: Scalars['String']['input'];
};

export type UpdateEmailTransportPayload = {
  __typename?: 'UpdateEmailTransportPayload';
  emailTransport?: Maybe<Array<EmailTransport>>;
};

export type UpdateEmailTransportSenderAddressInput = {
  address?: InputMaybe<Scalars['EmailAddress']['input']>;
  id: Scalars['UUID']['input'];
};

export type UpdateEmailTransportSenderAddressPayload = {
  __typename?: 'UpdateEmailTransportSenderAddressPayload';
  emailTransportSenderAddress?: Maybe<Array<EmailTransportSenderAddress>>;
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

export type AllSegmentsQueryVariables = Exact<{
  emailConfigurationId: Scalars['UUID']['input'];
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<EmailSegmentFilterInput>;
}>;


export type AllSegmentsQuery = { __typename?: 'Query', emailSegments?: { __typename?: 'EmailSegmentsConnection', nodes?: Array<{ __typename?: 'EmailSegment', id: any, name: string, expression?: any | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } | null };


export const AllProjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allProjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AllProjectsQuery, AllProjectsQueryVariables>;
export const AllSegmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allSegments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emailConfigurationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailSegmentFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailSegments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"emailConfigurationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emailConfigurationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"expression"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}}]} as unknown as DocumentNode<AllSegmentsQuery, AllSegmentsQueryVariables>;