import { gql } from "@apollo/client";

export const GET_ALL_POSTS = gql`
	query GetAllPosts {
		getAllPost {
			_id
			caption
			createdAt
			file
			likes
			location
			tags
			userId
		}
	}
`;

export const GET_POST_BY_ID = gql`
	query GetPostById($_id: String) {
		getPostById(_id: $_id) {
			caption
			file
			location
			tags
			userId
			_id
			createdAt
		}
	}
`;
