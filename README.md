# MTG Deck Builder Server

A server made to handle requests from a Magic the Gathering deck builder.

## Installing
```
> git clone https://github.com/Dkaf/mtg_capstone.git
> npm install
```

## Endpoints

### Add User
POST: '/users'
```
body: {
	username: username,
	password: password

}
```

### Get Card by ID
GET: '/cards/:id'

### Get Cards With Filters
GET: '/cards/:filters'
```
/cards/?rarity=rare&color=green
/cards/?type=zombie&color=black&cmc=5
```

### Create a Deck
POST: '/user/deck'
```
body: {
	name: name,
	format: format,
	user: user
}
```

### Get User Decks
GET: '/decks/:user'

### Add/Remove Cards from Deck
PUT: '/user/deck/:deckname'
```
body: {
	cards: cards
}
```

### Delete a Deck
DELETE: '/user/deck/:deckname'

## Technologies Used
<ul>
	<li>NodeJS</li>
	<li>Express</li>
	<li>Mongoose</li>
	<li>Bcrypt</li>
	<li>Passport</li>
</ul>

## React Front End
Github repo: https://github.com/Dkaf/mtg_react_capstone
website: https://dkaf.github.io/mtg_react_capstone/
