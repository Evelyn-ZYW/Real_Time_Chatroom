// this document is responsible for getting all the chat and data together

// adding new chat documents (new messages - called 'document' in firebase)
// setting up a real-time listener to get new chats
// updating the username
// updating the room

class Chatroom {
  constructor(username, room){
    this.username = username;
    this.room = room;
    this.chats = db.collection('chat');
    this.unsub;
  }
  async addChat(message){
    //format a chat object
    const now = new Date();
    const chat = {
      message: message,
      username: this.username,
      room: this.room,
      created_at: firebase.firestore.Timestamp.fromDate(now)
    };
    //save the chat document
    const response = await this.chats.add(chat);
    return response;
  }
  // real-time listener to get new chats
  getChats(callback){
    this.unsub = this.chats
      .where('room', '==', this.room)
      .orderBy('created_at')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if(change.type === 'added'){
            //update the UI
            callback(change.doc.data());
          }
        });
      });
  }
  updateName(username){
    this.username = username;
    localStorage.setItem('username', username);
  }
  updateRoom(room){
    this.room = room;
    console.log(room);
    if(this.unsub){
      this.unsub();
    }
  }
}