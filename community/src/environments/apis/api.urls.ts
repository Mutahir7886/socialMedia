import {environment} from "../environment";

export const apiUrls = {

  login: environment.baseUrl + '/auth/login',
  signup: environment.baseUrl +'/auth/signup',
  signout: environment.baseUrl + '/auth/users/me/logout',
  getPosts:  environment.baseUrl + '/posts/getposts',
  createPost: environment.baseUrl + '/posts',
  editPost: environment.baseUrl + '/posts/post',
  postComment : environment.baseUrl + '/posts/comment',
  postReplies: environment.baseUrl + '/posts/reply',
  deletePost :'https://socialmedia-dev.herokuapp.com/posts/post/',
  reaction: environment.baseUrl + '/posts/post/react',
  reaction_comment: environment.baseUrl + '/posts/comment/react',
  reaction_reply: environment.baseUrl + '/posts/reply/react',
  django: 'http://127.0.0.1:8000/resume/bio_data',
  ResumeEducationEdit: 'http://127.0.0.1:8000/resume/',

  // http://mutahirresumeappbuilder.herokuapp.com/
  // django: 'http://mutahirresumeappbuilder.herokuapp.com/resume/bio_data',
  // ResumeEducationEdit: 'http://mutahirresumeappbuilder.herokuapp.com/resume/',
}
