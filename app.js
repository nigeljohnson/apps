var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 8000;

app.listen(port);



// App Functionality //

var posts_mockup = [
	{ ID: 1, title: "First Post Title", permalink: 'http://example.com/1/', upvotes: 12, downvotes: 2 },
	{ ID: 22, title: "Second Post Title", permalink: 'http://example.com/2/', upvotes: 1, downvotes: 22 },
	{ ID: 33, title: "Third Post Title", permalink: 'http://example.com/3/', upvotes: 5, downvotes: 4 },
	{ ID: 44, title: "Fourth Post Title", permalink: 'http://example.com/4/', upvotes: 2, downvotes: 2 },
	{ ID: 55, title: "Fifth Post Title", permalink: 'http://example.com/5/', upvotes: 8, downvotes: 13 },
];

var $el;
var posts = {};
var votedOn = JSON.parse( localStorage.getItem( 'giar_votedOn' ) );

function getPostsFromServer( callback ) {
	// TODO: AJAX get posts from server
	
	posts = posts_mockup;
	if ( 'function' === typeof callback ) {
		callback.call();
	}
}
function getRandomPost() {
	var post = posts[ Math.floor( Math.random() * posts.length ) ];
	var current = $el.data( 'post' );
	if ( 'object' == typeof current && current.ID === post.ID ) {
		post = getRandomPost();
	}
	return post;
}
function showPost( post ) {
	$el.data( 'currentPost', post );
	$el.find( 'h1' ).text( post.title );
	$el.find( '.votes .up' ).text( post.upvotes );
	$el.find( '.votes .down' ).text( post.downvotes );
}

function getLS( key ) {
	var data = window.localStorage.getItem( key );
	try {
		return JSON.parse( data );
	} catch ( e ) {
		return data;
	}
}

function setLS( key, data ) {
	return window.localStorage.setItem( key, JSON.stringify( data ) );
}

function voteOnPost( post, updown ) {
	var readingList = getLS( 'readingList' ) || [];
	if ( 'up' === updown ) {
		if ( -1 === readingList.indexOf( post.ID ) ) {
			readingList.push ( post.ID );
			setLS( 'readingList', readingList );
			addReadingListElem( post );
		}
	}
	showPost( getRandomPost() );

	// TODO: AJAX send vote to server

}

function addReadingListElem( post ) {
	$el.find( '.reading-list ul' ).append( '<li data-id="' + post.ID + '"><a target=_blank href="' + post.permalink + '">' + post.title + '</a></li>' );
}

$( document ).ready( function() {
	$el = $( '.giar' );

	getPostsFromServer( initAfterAjax );

	function initAfterAjax() {
		showPost( getRandomPost() );

		// display saved reading list
		$el.find( '.reading-list ul' ).empty();
		var readingList = getLS( 'readingList' ) || [];
		$.each( readingList, function( i, ID ) {
			$.each( posts, function( i, post ) {
				if ( post.ID === ID ) {
					addReadingListElem( post );
				}
			} );
		} );
	}

	$el.on( 'click', '.votes span', function( e ) {
		voteOnPost( $el.data( 'currentPost' ), $( this ).attr( 'class' ) );
	} );

	$el.on( 'click', '.clear-list', function( e ) {
		e.preventDefault();
		setLS( 'readingList', [] );
		$el.find( '.reading-list ul' ).empty();
	} );

} );