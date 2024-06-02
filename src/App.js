import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setfriend] = useState(initialFriends);

  // Function to add a new friend to the list
  function handleaddfriend(newfriend) {
    setfriend(function (curfriends) {
      return [...curfriends, newfriend];
    });
  }

  // State for showing add friend form
  const [showaddFriends, setshowaddfriend] = useState(false);

  // Function to toggle showing add friend form
  function handleshowaddfriend() {
    setshowaddfriend(function (show) {
      return !show;
    });
  }

  const [selectedfriend, setselectedfriend] = useState(null);

  // Function to select a friend and show the split bill form
  function handleselection(friend) {
    setselectedfriend(function (selected) {
      return selected?.id === friend.id ? null : friend;
    });
  }
  // function to split
  function handlesplit(value) {
    setfriend((friends) =>
      friends.map((friend) =>
        friend.id === selectedfriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        {/* Conditionally render add friend form */}
        <Friendlist
          friends={friends}
          selectedfriend={selectedfriend}
          onSelection={handleselection}
        />
        {showaddFriends && <Formaddfriend onAddfriend={handleaddfriend} />}
        {/* Button to toggle showing add friend form */}
        <Button onClick={handleshowaddfriend}>
          {showaddFriends ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedfriend && (
        <FormSplit selectedfriend={selectedfriend} onSplitbill={handlesplit} />
      )}
    </div>
  );
}

// Function to add button because we will reuse it
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

// Function to display list of friends
function Friendlist({ friends, onSelection, selectedfriend }) {
  return (
    <ul>
      {friends.map(function (Friendsmap) {
        return (
          <Friend
            Friendsmap={Friendsmap}
            key={Friendsmap.id}
            selectedfriend={selectedfriend}
            onSelection={onSelection}
          />
        );
      })}
    </ul>
  );
}

// Function to display a single friend and image
function Friend({ Friendsmap, onSelection, selectedfriend }) {
  const isSelected = selectedfriend && selectedfriend.id === Friendsmap.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={Friendsmap.image} alt={Friendsmap.name} />
      <h3>{Friendsmap.name}</h3>
      {/* Displaying balance status by conditionally rendering */}
      {Friendsmap.balance < 0 ? (
        <p className="red">
          You owe {Friendsmap.name} {Friendsmap.balance}
        </p>
      ) : Friendsmap.balance > 0 ? (
        <p className="green">
          {Friendsmap.name} owes you {Friendsmap.balance}
        </p>
      ) : (
        <p>You and {Friendsmap.name} are even</p>
      )}
      <Button onClick={() => onSelection(Friendsmap)}>
        {isSelected ? "close" : "select"} friend
      </Button>
    </li>
  );
}

// Function to add a friend
function Formaddfriend({ onAddfriend }) {
  // State for form inputs
  const [name, setname] = useState("");
  const [image, setimage] = useState("https://i.pravatar.cc/48");

  // Form submit handler
  function handlesubmit(e) {
    e.preventDefault();
    if (!name || !image) return;

    // Create a new friend object
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };

    // Calling the function to add the friend
    onAddfriend(newFriend);

    // Reset form inputs
    setname("");
    setimage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handlesubmit}>
      <label>👩‍👦 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={function (e) {
          return setname(e.target.value);
        }}
      />
      <label>📲 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={function (e) {
          return setimage(e.target.value);
        }}
      />
      <Button>Add</Button>
    </form>
  );
}

// Function to split the bill
function FormSplit({ selectedfriend, onSplitbill }) {
  const [bill, setBill] = useState("");
  const [paybyuser, setPayuser] = useState("");
  const paidbyfriend = bill ? bill - paybyuser : 0;
  const [whoispaying, setWhospaying] = useState("user");

  function handlesubmitform(e) {
    e.preventDefault();
    if (!bill || !paybyuser) return; // Prevent submission if bill or paybyuser is not set

    const splitValue = whoispaying === "user" ? paidbyfriend : -paybyuser;
    onSplitbill(splitValue);
  }

  return (
    <form className="form-split-bill" onSubmit={handlesubmitform}>
      <h2>Split a bill with {selectedfriend.name}</h2>
      <label>💴 Bill value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>👧 Your expenses</label>
      <input
        type="number"
        value={paybyuser}
        onChange={(e) => setPayuser(Math.min(Number(e.target.value), bill))}
      />
      <label>👩‍👦 {selectedfriend.name}'s expenses</label>
      <input type="number" disabled value={paidbyfriend} />
      <label>💴 Who is paying the bill</label>
      <select
        value={whoispaying}
        onChange={(e) => setWhospaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedfriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
