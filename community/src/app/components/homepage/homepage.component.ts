import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpService} from "../../services/http.service";
import {apiUrls} from "../../../environments/apis/api.urls";
import {ActionService} from "../../services/actionService";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Socket} from "ngx-socket-io";

// import {signOutValue} from "../../app.component";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomepageComponent implements OnInit {
  pageNo = 0;
  post_array = [];
  commentexist = false;
  formGroup: FormGroup;
  formGroup1: FormGroup;
  formGroup2: FormGroup;
  imageValue;
  post_id_to_Edit;
  post_index_to_Edit;
  commentIdToEdit;
  reply_id_to_Edit;
  profilePic = JSON.parse(localStorage.getItem('user_object')).profile_pic
  checkid = JSON.parse(localStorage.getItem('user_object'))._id;
  reaction_count_like: number = 0;
   totalPostReactions;
   checkreactionlikecount;
   checkreactiondislikecount;
   checkreactionlovecount;
   showcomments =false;


  constructor(private httpService: HttpService,
              private actionservice: ActionService,
              public router: Router,private changeDetection:ChangeDetectorRef,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private socket: Socket) {
    this.formGroup = this.formBuilder.group({
      description: ['', [Validators.required, Validators.minLength(10)]],
      title: ['',],
      UserImage: ['', [Validators.required]],
    });
    this.formGroup1 = this.formBuilder.group({
      comment: ['', [Validators.required]],
    });
    this.formGroup2 = this.formBuilder.group({
      reply: ['', [Validators.required]],
    });
    socket.on("postReacted", (data) => {
      console.log('postReacted', data._posts);
      this.setCommentParameter(data._posts);
      this.reactpostsocket(data._posts);
    });
    socket.on("commentReacted", (data) => {
      console.log('commentReacted', data._posts);
      this.setCommentParameter(data._posts);
      this.reactcommentsocket(data._posts,data.commentId);
    });
    socket.on("replyReacted", (data) => {
      console.log('replyReacted', data._posts);
      this.setCommentParameter(data._posts);
      this.reactreplysocket(data._posts,data.commentId,data.replyId);
    });
    socket.on("newComment", (data) => {
      console.log('newComment', data);
      this.setCommentParameter(data._posts);
      this.reactnewcommentsocket(data._posts);
    });
    socket.on("newReply", (data) => {
      console.log('newReply', data);
      this.setCommentParameter(data._posts);
      this.reactnewreplysocket(data._posts,data.commentId);

    });
    socket.on("editComment", (data) => {
      console.log('editComment', data);
      this.setCommentParameter(data._posts);
      this.reacteditcommentsocket(data._posts,data.commentId);
    });
    socket.on("editReply", (data) => {
      console.log('editReply', data);
      this.setCommentParameter(data._posts);
      this.reacteditreplysocket(data._posts,data.commentId,data.replyId);
    });
    socket.on("delComment", (data) => {
      console.log('deleteComment', data);
      this.setCommentParameter(data._posts);
      this.reactdeletecommentsocket(data._posts,data.commentId);
    });
    socket.on("delReply", (data) => {
      console.log('delReply', data);
      this.setCommentParameter(data._posts);
      this.reactdeletereplysocket(data._posts,data.commentId,data.replyId);
    });
    socket.on("newPost", (data) => {
      console.log('newPost', data);
      this.setCommentParameter(data._posts);
      this.reactnewpostsocket(data._posts);
    });
    socket.on("editPost", (data) => {
      console.log('editPost', data);
      this.setCommentParameter(data._posts);
      this.reacteditpostsocket(data._posts);
    });
    socket.on("delPost", (data) => {
      console.log('delPost', data);
      // this.setCommentParameter(data.post);
      this.reactdeletepostsocket(data.postId);
    });

  }

  ngOnInit(): void
  {
   console.log(this.checkid)
    this.httpService.post(apiUrls.getPosts, {page: this.pageNo}).subscribe(data =>
    {
      data._posts.forEach(value => {
        this.setCommentParameter(value)
      });
      this.post_array = data._posts;
      console.log(this.post_array)
    });
  }

  reactpostsocket(newpost) {

    for (let i = 0; i < this.post_array.length; i++) {
      if (this.post_array[i]._id == newpost._id) {
        this.post_array[i].reactions = newpost.reactions;
        this.post_array[i].likeCount= newpost.likeCount
        this.post_array[i].dislikeCount= newpost.dislikeCount
        this.post_array[i].Love= newpost.Love
      }
    }
  }
  reactcommentsocket(newpost, commentID) {
   let postToBeEdited;
   let commentToBeEdited;
   let commentToBeEditedIndex;
    for (let i = 0; i < this.post_array.length; i++) {
      if (this.post_array[i]._id == newpost._id)
      {
        postToBeEdited = this.post_array[i];
      }
    }
    for (let i = 0; i < newpost.comments.length; i++) {
      if (newpost.comments[i]._id === commentID)
      {
        commentToBeEdited= newpost.comments[i];
        commentToBeEditedIndex = i;
      }
    }
    postToBeEdited.comments[commentToBeEditedIndex].reactions = commentToBeEdited.reactions;
    postToBeEdited.comments[commentToBeEditedIndex].commentlikecount = commentToBeEdited.commentlikecount;
    postToBeEdited.comments[commentToBeEditedIndex].commentdislikecount = commentToBeEdited.commentdislikecount;
    postToBeEdited.comments[commentToBeEditedIndex].commentlovecount = commentToBeEdited.commentlovecount;

  }
  reactreplysocket(newpost, CommentID, ReplyID) {
    let postToBeEdited;
    let commentToBeEdited;
    let commentToBeEditedIndex;
    let replyToBeEdited;
    let replyToBeEditedIndex

    for (let i = 0; i < this.post_array.length; i++) {
      if (this.post_array[i]._id == newpost._id)
      {
        postToBeEdited = this.post_array[i];
      }
    }
    for (let i = 0; i < newpost.comments.length; i++) {
      if (newpost.comments[i]._id === CommentID)
      {
        commentToBeEdited= newpost.comments[i];
        commentToBeEditedIndex = i;
      }
    }
    console.log(commentToBeEditedIndex);
    for (let i = 0; i < newpost.comments[commentToBeEditedIndex].replies.length; i++) {
      if (newpost.comments[commentToBeEditedIndex].replies[i]._id === ReplyID)
      {
        replyToBeEdited= newpost.comments[commentToBeEditedIndex].replies[i];
        replyToBeEditedIndex = i;
      }
    }
    console.log(replyToBeEditedIndex);
    console.log(replyToBeEdited);

    postToBeEdited.comments[commentToBeEditedIndex].replies[replyToBeEditedIndex].reactions = replyToBeEdited.reactions;
    postToBeEdited.comments[commentToBeEditedIndex].replies[replyToBeEditedIndex].replylikecount = replyToBeEdited.replylikecount;
    postToBeEdited.comments[commentToBeEditedIndex].replies[replyToBeEditedIndex].replydislikecount = replyToBeEdited.replydislikecount;
    postToBeEdited.comments[commentToBeEditedIndex].replies[replyToBeEditedIndex].replylovecount = replyToBeEdited.replylovecount;

  }
  reactnewcommentsocket(newpost){
    console.log('new');
    console.log(newpost);
    console.log(newpost.comments);
    let postToBeEdited;
    for (let i = 0; i < this.post_array.length; i++) {
      if (this.post_array[i]._id == newpost._id)
      {
        postToBeEdited = this.post_array[i];
      }
    }
    postToBeEdited.comments.unshift(newpost.comments[newpost.comments.length -1])
  }
  reactnewreplysocket(newpost,commentID){

    let postToBeEdited;
    let commentToBeEdited;
    let commentToBeEditedIndex;
    for (let i = 0; i < this.post_array.length; i++) {
      if (this.post_array[i]._id == newpost._id)
      {
        postToBeEdited = this.post_array[i];
      }
    }
    for (let i = 0; i < newpost.comments.length; i++) {
      if (newpost.comments[i]._id === commentID)
      {
        commentToBeEdited= newpost.comments[i];
        commentToBeEditedIndex = i;
      }
    }
     postToBeEdited.comments[commentToBeEditedIndex].replies.
     push(newpost.comments[commentToBeEditedIndex].replies
       [newpost.comments[commentToBeEditedIndex].replies.length -1])

  }
  reacteditcommentsocket(newpost,commentID){

    let postToBeEdited;
    let commentToBeEdited;
    let commentToBeEditedIndex;
    for (let i = 0; i < this.post_array.length; i++) {
      if (this.post_array[i]._id == newpost._id)
      {
        postToBeEdited = this.post_array[i];
      }
    }
    for (let i = 0; i < newpost.comments.length; i++) {
      if (newpost.comments[i]._id === commentID)
      {
        commentToBeEdited= newpost.comments[i];
        commentToBeEditedIndex = i;
      }
    }
    console.log(commentToBeEditedIndex)
    postToBeEdited.comments[commentToBeEditedIndex] = newpost.comments[commentToBeEditedIndex]
  }
  reacteditreplysocket(newpost, CommentID, ReplyID){
    let postToBeEdited;
    let commentToBeEdited;
    let commentToBeEditedIndex;
    let replyToBeEdited;
    let replyToBeEditedIndex

    for (let i = 0; i < this.post_array.length; i++) {
      if (this.post_array[i]._id == newpost._id)
      {
        postToBeEdited = this.post_array[i];
      }
    }
    for (let i = 0; i < newpost.comments.length; i++) {
      if (newpost.comments[i]._id === CommentID)
      {
        commentToBeEdited= newpost.comments[i];
        commentToBeEditedIndex = i;
      }
    }
    console.log(commentToBeEditedIndex);
    for (let i = 0; i < newpost.comments[commentToBeEditedIndex].replies.length; i++) {
      if (newpost.comments[commentToBeEditedIndex].replies[i]._id === ReplyID)
      {
        replyToBeEdited= newpost.comments[commentToBeEditedIndex].replies[i];
        replyToBeEditedIndex = i;
      }
    }
    postToBeEdited.comments[commentToBeEditedIndex].replies[replyToBeEditedIndex]=
      newpost.comments[commentToBeEditedIndex].replies[replyToBeEditedIndex]
  }
  reactdeletecommentsocket(newpost,commentID) {
    console.log(newpost)
    let postToBeEdited;
    // let postToBeEditedIndex;
    let commentToBeEdited;
    let commentToBeEditedIndex;
    for (let i = 0; i < this.post_array.length; i++) {
      if (this.post_array[i]._id == newpost._id)
      {
        // postToBeEditedIndex = i;
        postToBeEdited = this.post_array[i];
      }
    }
    for (let i = 0; i < postToBeEdited.comments.length; i++) {
      if (postToBeEdited.comments[i]._id === commentID)
      {
        commentToBeEdited= postToBeEdited.comments[i];
        commentToBeEditedIndex = i;
      }
    }

    postToBeEdited.comments.splice(commentToBeEditedIndex,1);
  }
  reactdeletereplysocket(newpost, CommentID, ReplyID){

    let postToBeEdited;
    let commentToBeEdited;
    let commentToBeEditedIndex;
    let replyToBeEdited;
    let replyToBeEditedIndex

    for (let i = 0; i < this.post_array.length; i++) {
      if (this.post_array[i]._id == newpost._id)
      {
        postToBeEdited = this.post_array[i];
      }
    }
    for (let i = 0; i < postToBeEdited.comments.length; i++) {
      if (postToBeEdited.comments[i]._id === CommentID)
      {
        commentToBeEdited= postToBeEdited.comments[i];
        commentToBeEditedIndex = i;
      }
    }
    console.log(commentToBeEditedIndex);
    for (let i = 0; i < postToBeEdited.comments[commentToBeEditedIndex].replies.length; i++) {
      if (postToBeEdited.comments[commentToBeEditedIndex].replies[i]._id === ReplyID)
      {
        replyToBeEdited= postToBeEdited.comments[commentToBeEditedIndex].replies[i];
        replyToBeEditedIndex = i;
      }
    }

    postToBeEdited.comments[commentToBeEditedIndex].replies.splice(replyToBeEditedIndex,1)
  }
  reactnewpostsocket(newpost){
    this.post_array.unshift(newpost);
  }
  reacteditpostsocket(newpost){
    let postToBeEdited;
    let commentToBeEdited;
    let commentToBeEditedIndex;
    for (let i = 0; i < this.post_array.length; i++) {
      if (this.post_array[i]._id == newpost._id)
      {
        postToBeEdited = this.post_array[i];
      }
    }
    postToBeEdited.title = newpost.title
    postToBeEdited.description =newpost .description
    postToBeEdited.post_pic = newpost.post_pic

  }
  reactdeletepostsocket(postid){

    let postIndexToBeDeleted;
    for (let i = 0; i < this.post_array.length; i++) {
      if (this.post_array[i]._id == postid)
      {
        postIndexToBeDeleted =i
      }
    }
    this.post_array.splice(postIndexToBeDeleted,1)
  }

  get Reply(): FormControl {
    return this.formGroup2.get('reply') as FormControl;
  }

  get comment(): FormControl {
    return this.formGroup1.get('comment') as FormControl;
  }

  get UserImage(): FormControl {
    return this.formGroup.get('UserImage') as FormControl;
  }

  get title(): FormControl {
    return this.formGroup.get('title') as FormControl;
  }

  get description(): FormControl {
    return this.formGroup.get('description') as FormControl;
  }

  signout() {
    // signOutValue[0]= true;

    this.httpService.get(apiUrls.signout).subscribe(data => {
      console.log(data)
      this.actionservice.loginSubscription.next(true);
      localStorage.removeItem('user_info')
      this.router.navigate(['/login']);
    });
  }

  loaddata() {
    this.pageNo = this.pageNo + 1;

    this.httpService.post(apiUrls.getPosts, {page: this.pageNo}).subscribe(data => {
      data._posts.forEach(value => {
        this.setCommentParameter(value)
        this.post_array.push(value)
      })
      console.log(this.post_array);
    });

  }

  writecomment() {
    this.commentexist = true;
  }


  commentOfPost(index, newComment, post_id) {
    this.post_array[index].commentsaving = true;
    console.log(this.post_array[index].comments)

    this.httpService.post(apiUrls.postComment, {
      comment: newComment,
      postId: post_id,
      userId: JSON.parse(localStorage.getItem('user_object'))._id
    }).subscribe(data => {
      // this.setCommentParameter(data._posts);
      console.log(data._posts.comments)
      // this.post_array[index].comments.push(data._posts.comments[data._posts.comments.length -1])
      // this.post_array[index] = data._posts;
      // this.post_array[index].comments.push(data._posts.comments[data._posts.comments.length -1])
      this.post_array[index].newComment = ' '
      this.post_array[index].commentsaving = false;
    });
  }

  reply(index,commentindex, newreply, post_id, comment_id) {
    this.httpService.post(apiUrls.postReplies, {
      reply: newreply,
      commentId: comment_id,
      postId: post_id,
      userId: JSON.parse(localStorage.getItem('user_object'))._id
    }).subscribe(data => {
      console.log(data)

      this.setCommentParameter(data._posts)
      // this.post_array[index] = data._posts;
         this.post_array[index].comments[commentindex].newReply = ' '
        this.post_array[index].comments[commentindex].addNewReply = false

    });


  }

  setCommentParameter(post) {
    post.likeCount = 0
    post.dislikeCount = 0
    post.Love = 0
    post.reactionloading = false;
    post.userreaction = 123;
    post.commentsloading= false;
    post.commentsaving= false;
    post.loadmorecomments = 2;
    post.reactions.forEach(value => {
      if (value.reactionType == 0) {
        post.likeCount = post.likeCount + 1;
      } else if (value.reactionType == 3) {
        post.dislikeCount = post.dislikeCount + 1;
      } else if (value.reactionType == 1) {
        post.Love = post.Love + 1;
      }
      if (value.userId._id == this.checkid)
      {
        post.userreaction= value.reactionType;
      }

    });


    post.addNewComment = false;
    post.newComment = '';

    post.comments.forEach(element => {
      element.commentlikecount = 0;
      element.commentdislikecount = 0;
      element.commentlovecount = 0;
      element.commentreactionloading = false


      element.reactions.forEach(commentvalue => {
        if (commentvalue.reactionType == 0) {
          element.commentlikecount = element.commentlikecount + 1;
        } else if (commentvalue.reactionType == 3) {
          element.commentdislikecount = element.commentdislikecount + 1;
        } else if (commentvalue.reactionType == 1) {
          element.commentlovecount = element.commentlovecount + 1;
        }
      });
      this.setReplyParameter(element);
      this.function(element);
    })
  }

  setReplyParameter(comment) {
    comment.addNewReply = false;
    comment.newReply = '';
    comment.loadmorereplies = 1;

  }

  function(comment) {
    comment.replies.forEach(reply => {
      reply.replylikecount = 0;
      reply.replydislikecount = 0;
      reply.replylovecount = 0;
      reply.replyreactionloading = false;

      reply.reactions.forEach(replyreaction => {
        if (replyreaction.reactionType == 0) {
          reply.replylikecount = reply.replylikecount + 1;
        } else if (replyreaction.reactionType == 3) {
          reply.replydislikecount = reply.replydislikecount + 1;
        } else if (replyreaction.reactionType == 1) {
          reply.replylovecount = reply.replylovecount + 1;
        }
      });
    });
  }


// for (let i = 0; i < this.post_array.length; i++){
//   if(post_id === this.post_array[i]._id){
//     this.post_array[i] = data._posts;
//   }
// }


  createPost(formGroup) {

    formGroup.value.userId = JSON.parse(localStorage.getItem('user_object'))._id
    formGroup.value.post_pic = this.UserImage.value
    console.log(formGroup.value);
    formGroup.value.title = ' ';
    console.log(formGroup.value)
    this.httpService.post(apiUrls.createPost, formGroup.value).subscribe(data => {
      this.post_array.unshift(data._posts)
      formGroup.reset()
    }, error => {
      console.log(error);
    });

  }


  readUrl(files: any) {
    let mimeType;
    let file;
    if (files.target) {
      if (files.target.files.length === 0) {
        return;
      }
      // Image upload validation
      mimeType = files.target.files[0].type;
      file = files.target.files[0];
    } else {
      mimeType = files.type;
      file = files;
    }
    if (mimeType.match(/image\/*/) == null) {
      // this.toaster.error('Wrong Image selected');
      return;
    }

    // Image upload
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      console.log('yes');
      this.imageValue = reader.result;
      this.UserImage.setValue(this.imageValue);
    };
  }

  deletepost(indextodelete, postid) {
    console.log(indextodelete)
    console.log(postid)
    this.httpService.put(apiUrls.editPost, {
      postId: postid,
      userId: JSON.parse(localStorage.getItem('user_object'))._id,

    }).subscribe(data => {
      console.log('successful')

      this.post_array.splice(indextodelete, 1)
    });
  }

  openModal(index, modal, title, description, image, post_id) {
    this.modalService.open(modal, {backdrop: 'static', keyboard: false});
    this.post_id_to_Edit = post_id;
    this.post_index_to_Edit = index;
    this.title.setValue(title);
    this.description.setValue(description);
    this.UserImage.setValue(image)
  }

  close() {
    this.formGroup.reset();
    this.modalService.dismissAll()
  }

  goedit() {
    console.log(this.UserImage.value)
    this.httpService.patch(apiUrls.editPost, {
      title: this.title.value,
      description: this.description.value,
      post_pic: this.UserImage.value,
      userId: JSON.parse(localStorage.getItem('user_object'))._id,
      postId: this.post_id_to_Edit,
    }).subscribe(data => {

      this.post_array[this.post_index_to_Edit].title = this.title.value
      this.post_array[this.post_index_to_Edit].description = this.description.value
      this.post_array[this.post_index_to_Edit].post_pic = this.UserImage.value
      this.formGroup.reset();
    });
    this.modalService.dismissAll();
  }

  noedit() {
    this.formGroup.reset();
    this.modalService.dismissAll()
  }

  openModal1(index, modal, comment_to_edit, comment_id, post_id) {
    this.modalService.open(modal, {backdrop: 'static', keyboard: false});
    this.comment.setValue(comment_to_edit)
    this.commentIdToEdit = comment_id;
    this.post_id_to_Edit = post_id;
    this.post_index_to_Edit = index;

  }

  editComment() {
    console.log(this.comment.value)
    this.httpService.patch(apiUrls.postComment, {
      comment: this.comment.value,
      commentId: this.commentIdToEdit,
      postId: this.post_id_to_Edit,
      userId: JSON.parse(localStorage.getItem('user_object'))._id,

    }).subscribe(data => {

      this.setCommentParameter(data._posts);
      console.log('123')
      console.log(data)
      console.log(data._posts)
      this.post_array[this.post_index_to_Edit] = data._posts


    });
    this.modalService.dismissAll();
  }


  deleteComment(index, commentId, PostId) {
    this.httpService.put(apiUrls.postComment, {
      postId: PostId,
      commentId: commentId,
      userId: JSON.parse(localStorage.getItem('user_object'))._id,

    }).subscribe(data => {
      console.log(data)
      console.log(data._posts)
      this.setCommentParameter(data._posts)
      this.post_array[index] = data._posts
    });
  }

  deleteReply(index, postId, CommentId, ReplyId) {
    this.httpService.put(apiUrls.postReplies, {
      commentId: CommentId,
      userId: JSON.parse(localStorage.getItem('user_object'))._id,
      postId: postId,
      replyId: ReplyId,

    }).subscribe(data => {
      console.log(data._posts)
      this.setCommentParameter(data._posts)
      this.post_array[index] = data._posts
    });
  }

  openModal2(index, modal, reply, replyId, CommentId, PostID) {
    console.log(reply);
    this.Reply.setValue(reply);
    this.modalService.open(modal, {backdrop: 'static', keyboard: false});
    this.commentIdToEdit = CommentId;
    this.post_id_to_Edit = PostID;
    this.post_index_to_Edit = index;
    this.reply_id_to_Edit = replyId
  }

  editReply() {
    console.log(this.Reply.value)
    this.httpService.patch(apiUrls.postReplies, {
      reply: this.Reply.value,
      commentId: this.commentIdToEdit,
      postId: this.post_id_to_Edit,
      userId: JSON.parse(localStorage.getItem('user_object'))._id,
      replyId: this.reply_id_to_Edit,

    }).subscribe(data => {
      this.setCommentParameter(data._posts);
      console.log(data)
      console.log(data._posts)
      this.post_array[this.post_index_to_Edit] = data._posts

    });
    this.modalService.dismissAll();
  }


  reactionpost(postID, reactionType, index) {
    this.post_array[index].reactionloading = true;
    console.log(reactionType);
    this.httpService.post(apiUrls.reaction, {
      postId: postID,
      reactionType: reactionType,
      userId: JSON.parse(localStorage.getItem('user_object'))._id,
    }).subscribe(data => {

      let likecount = 0;
      let dislikecount = 0;
      let love = 0;
      this.post_array[index].userreaction = 123;
      data._posts.reactions.forEach(value => {
        if (value.reactionType == 0) {
          likecount = likecount + 1;
        } else if (value.reactionType == 3) {
          dislikecount = dislikecount + 1
        } else if (value.reactionType == 1) {
          love = love + 1
        }
        if (value.userId._id == this.checkid)
        {
          this.post_array[index].userreaction= value.reactionType;
        }
      });
      // this.post_array[index].userreaction = reactionType;
      this.post_array[index].reactions = data._posts.reactions;
      this.post_array[index].likeCount = likecount;
      this.post_array[index].dislikeCount = dislikecount;
      this.post_array[index].Love = love;
      this.post_array[index].reactionloading = false;
    });

  }


  reactioncomment(postID, commentId, reactionType, index, commentindex) {
    this.post_array[index].comments[commentindex].commentreactionloading = true
    this.httpService.post(apiUrls.reaction_comment, {
      postId: postID,
      commentId: commentId,
      reactionType: reactionType,
      userId: JSON.parse(localStorage.getItem('user_object'))._id,
    }).subscribe(data => {
      console.log('sucessful')
      console.log(data)

      let likecommentcount = 0;
      let dislikecommentcount = 0;
      let lovecommentcount = 0;
      data._posts.comments.forEach(commentvalue => {
        if (commentId == commentvalue._id) {
          commentvalue.reactions.forEach(everyreaction => {
            if (everyreaction.reactionType == 0) {
              likecommentcount = likecommentcount + 1;
            } else if (everyreaction.reactionType == 3) {
              dislikecommentcount = dislikecommentcount + 1;
            } else if (everyreaction.reactionType == 1) {
              lovecommentcount = lovecommentcount + 1;
            }

          })
        }
      });
      this.post_array[index].comments[commentindex].commentlikecount = likecommentcount
      this.post_array[index].comments[commentindex].commentdislikecount = dislikecommentcount
      this.post_array[index].comments[commentindex].commentlovecount = lovecommentcount
      this.post_array[index].comments[commentindex].commentreactionloading = false;
    });

  }

  reactionreply(postID, commentId, replyID, reactionType, index, commentindex, replyindex) {
    console.log('ok')
    this.post_array[index].comments[commentindex].replies[replyindex].replyreactionloading = true;
    this.httpService.post(apiUrls.reaction_reply, {
      postId: postID,
      replyId: replyID,
      commentId: commentId,
      reactionType: reactionType,
      userId: JSON.parse(localStorage.getItem('user_object'))._id,
    }).subscribe(data => {
      console.log('sucessful')
      console.log(data)
      let likereplycount = 0;
      let dislikereplycount = 0;
      let lovereplycount = 0;
      data._posts.comments[commentindex].replies[replyindex].reactions.forEach(reaction => {
        if (reaction.reactionType == 0) {
          likereplycount = likereplycount + 1;
        } else if (reaction.reactionType == 3) {
          dislikereplycount = dislikereplycount + 1;
        } else if (reaction.reactionType == 1) {
          lovereplycount = lovereplycount + 1;
        }
      });
      this.post_array[index].comments[commentindex].replies[replyindex].replylikecount = likereplycount;
      this.post_array[index].comments[commentindex].replies[replyindex].replydislikecount = dislikereplycount;
      this.post_array[index].comments[commentindex].replies[replyindex].replylovecount = lovereplycount;
      this.post_array[index].comments[commentindex].replies[replyindex].replyreactionloading = false;

    });

  }

  openModal4(postindex, post, modal) {
    console.log(post)
    this.totalPostReactions = post.reactions
    this.checkreactionlikecount=post.likeCount;
    this.checkreactiondislikecount=post.dislikeCount;
    this.checkreactionlovecount=post.Love;

    this.modalService.open(modal, {backdrop: 'static', keyboard: false});

  }

  enter($event: KeyboardEvent,i,postnewComment,postid) {
    // tslint:disable-next-line:triple-equals

    if ($event.key =='Enter'){
      this.commentOfPost(i,postnewComment,postid)
  }
  }
}
