export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]: Maybe<T[SubKey]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string
	String: string
	Boolean: boolean
	Int: number
	Float: number
}

export enum Gate {
	Entry = 'Entry',
	Exit = 'Exit'
}

export type Mutation = {
	__typename?: 'Mutation'
	cancelReservation: Void
	createReservation: Void
	openGate: Void
}

export type MutationCancelReservationArgs = {
	licensePlate: Scalars['String']
	spot: Scalars['ID']
}

export type MutationCreateReservationArgs = {
	licensePlate: Scalars['String']
	spot: Scalars['ID']
	time: Scalars['Int']
}

export type MutationOpenGateArgs = {
	gate: Gate
}

export type ParkedCar = {
	__typename?: 'ParkedCar'
	arrival: Scalars['Int']
	licensePlate: Scalars['String']
}

export type Query = {
	__typename?: 'Query'
	parkedCars: Array<ParkedCar>
	reservations: Array<Reservation>
	spots: Spots
}

export type Reservation = {
	__typename?: 'Reservation'
	carArrived: Scalars['Boolean']
	creationTimestamp: Scalars['String']
	expirationTimestamp: Scalars['String']
	licensePlate: Scalars['String']
	spot: Scalars['ID']
}

export type Spots = {
	__typename?: 'Spots'
	taken: Scalars['Int']
	total: Scalars['Int']
}

export type Void = {
	__typename?: 'Void'
	success: Scalars['Boolean']
}

export type Unnamed_1_MutationVariables = Exact<{
	gate: Gate
}>

export type Unnamed_1_Mutation = {
	__typename?: 'Mutation'
	openGate: { __typename?: 'Void'; success: boolean }
}

export type Unnamed_2_QueryVariables = Exact<{ [key: string]: never }>

export type Unnamed_2_Query = {
	__typename?: 'Query'
	spots: { __typename?: 'Spots'; taken: number; total: number }
}

export type Unnamed_3_QueryVariables = Exact<{ [key: string]: never }>

export type Unnamed_3_Query = {
	__typename?: 'Query'
	parkedCars: Array<{
		__typename?: 'ParkedCar'
		licensePlate: string
		arrival: number
	}>
}

export type Unnamed_4_MutationVariables = Exact<{
	spot: Scalars['ID']
	licensePlate: Scalars['String']
	time: Scalars['Int']
}>

export type Unnamed_4_Mutation = {
	__typename?: 'Mutation'
	createReservation: { __typename?: 'Void'; success: boolean }
}

export type Unnamed_5_MutationVariables = Exact<{
	spot: Scalars['ID']
	licensePlate: Scalars['String']
}>

export type Unnamed_5_Mutation = {
	__typename?: 'Mutation'
	cancelReservation: { __typename?: 'Void'; success: boolean }
}

export type Unnamed_6_QueryVariables = Exact<{ [key: string]: never }>

export type Unnamed_6_Query = {
	__typename?: 'Query'
	reservations: Array<{
		__typename?: 'Reservation'
		spot: string
		licensePlate: string
		creationTimestamp: string
		expirationTimestamp: string
		carArrived: boolean
	}>
}
