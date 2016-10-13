#!/usr/bin/env node
const program = require('commander')
    , blessed = require('blessed')
    , contrib = require('blessed-contrib')
    , Twitter = require('twitter')
    , db = require('sqlite')
    , inquirer = require('inquirer')
    , Config = require('config')
    

// Twitter API information
const TWITTER_CONSUMER_KEY = Config.get('Twitter.consumer_key')
    , TWITTER_CONSUMER_SECRET = Config.get('Twitter.consumer_secret')
    , TWITTER_ACCESS_TOKEN_KEY = Config.get('Twitter.access_token_key')
    , TWITTER_ACCESS_TOKEN_SECRET = Config.get('Twitter.access_token_secret')

// Database connection
db.open('./twitter-desk.sqlite').then(() => {
    return db.run("CREATE TABLE IF NOT EXISTS desk_tweets (id, text, created_at, retweet_count, in_reply_to_user_id, in_reply_to_screen_name, in_reply_to_status_id, favorited, user_screen_name, user_id)")
}).catch((err) => {
    console.error('DATABASE ERROR >', err)
})
    
var client = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

program
    .version('0.0.1')
    .usage('None yet ;)')
    .description('None yet ;)')
    .option('-l, --lookup <account>', 'Analyse le compte Twitter de la personne mentionnée', /^@?(\w){1,15}$/i)
    .option('-m, --me', 'Analyse votre compte Twitter (vous devez être connecté)')

program.parse(process.argv)

if (program.lookup) {
    console.log('Lookup for an account:', program.lookup)
    twetterDesk(program.lookup)
} else if (program.me) {
    console.log('Lookup my account:', true)
    twetterDesk("SpyL1nk")
}

function twetterDesk(account) {
    var screen = blessed.screen()

    var grid = new contrib.grid({rows: 12, cols: 12, screen: screen})

    //grid.set(row, col, rowSpan, colSpan, obj, opts)
    var twitter_acc_box = grid.set(0, 0, 3, 6, blessed.box, {label: 'Twitter account'})
    var twitter_stats_box = grid.set(3, 0, 4, 6, blessed.box, {label: 'Twitter statistics'})
    var twitter_hist_box = grid.set(7, 0, 5, 6, blessed.box, {label: 'Twitter history'})
    var tweets_box = grid.set(0, 6, 6, 6, blessed.box, {label: 'Tweets'})
    var followers_box = grid.set(6, 6, 6, 6, blessed.box, {label: 'Followers'})

    twitterAccount(account, twitter_acc_box, screen).then((account) => {
        // TODO: Add option to add a limit for tweet searching
        tweets(account, 200, tweets_box, screen)
    }).then(() => { /*console.log('Récupération des tweets terminé, on peut passer aux followers!')*/ })

    screen.render()
}

function twitterAccount(account, box, screen) {
    return new Promise((resolve, reject) => {
        client.get('users/show', {screen_name: account}, function(error, response) {
            if(error) {
                twitterErrors(error, box, screen)
                reject(error)
            } else {
                // TODO: Modification de la date d'inscription sur Tweeter pour la rendre plus jolie.
                box.setContent(response.screen_name + " - @" + response.name + " - Compte véririfé : " + response.verified + "\n\n" + response.statuses_count + " tweets - " + response.followers_count + " followers - " + response.friends_count + " abonnements \n\n A rejoint Twitter le " + response.created_at + " avec le numéro d'utilisateur: " + response.id + "\n\n" + response.description + "\n\n" + response.url + " - " + response.location)
                screen.render()
                resolve(response)
            }
        })
    })
}

function tweets(account, limit, box, screen) {
    return new Promise((resolve, reject) => {
        getLatestTweet(account).then((latestTweet) => {
            var latestTweetId = latestTweet.id_str
            // We check in database if tweets were already imported from a last search
            db.all("SELECT * FROM desk_tweets WHERE user_id = ? ORDER BY id DESC LIMIT 1", account.id_str).then((rows) => {
                if(rows.length > 0) {
                    var latestDBTweetId = rows[0].id
                    console.log('if:', latestTweetId != latestDBTweetId)
                    if (latestTweetId != latestDBTweetId) {
                        // Danger, risque d'épuisement du nombre de requêtes maximales autorisées par l'API. Un compteur de requêtes sera nécessaire !
                        fetchTweets(account, latestDBTweetId, limit, latestTweetId)
                    }
                } else {
                    // No tweets from this user in our database, let's fill it!
                    var latestDBTweetId = 1
                    
                    fetchTweets(account, latestDBTweetId, limit, latestTweetId)
                }
            }).then(() => { resolve() }).catch((err) => { reject(error) })
        })
    })
}

function fetchTweets(account, since, limit, latestTweetId) {
    client.get('statuses/user_timeline', {user_id: account.id,  since_id: since, count: limit, include_rts: false}, function(error, response) {
        if (error) {
            return new Error(twitterErrors(error))
        } else {
            
            for (var i=0, l=response.length; i<l; i++) {
                db.run("INSERT INTO desk_tweets VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [response[i].id_str, response[i].text, response[i].created_at, response[i].retweet_count, response[i].in_reply_to_user_id_str, response[i].in_reply_to_screen_name, response[i].in_reply_to_status_id_str, response[i].favorited, response[i].user.screen_name, response[i].user.id_str])
            }
            // Twitter API give us tweets by order desc
            if (response[0].id != latestTweetId) {
                fetchTweets(account, response[0].id, limit, latestTweetId)
            }
        }
    })
}

// TODO: Improve fetching in case of the user only retweet
function getLatestTweet(account) {
    return new Promise((resolve, reject) => {
        client.get('statuses/user_timeline', {user_id: account.id, count: 200, include_rts: false}, function(error, response) {
            if (error) {
                return new Error(twitterErrors(error))
            } else {
                if(!response[0]) {
                    reject('No latest tweet found!')
                } else {
                    resolve(response[0])
                }
            }
        })
    })
}

function twitterErrors(error, box, screen) {
    var errorMessage = ""
    
    // Improve error gestion in case of multiple errors even if only one error can be returned
    switch(error[0].code) {
        case 32:
            errorMessage = "Twitter n'a pas pu vous authentifier."
            break;
        case 34:
            errorMessage = "Twitter n'a pas pu trouver cette page."
            break;
        case 50:
            errorMessage = "Utilisateur introuvable, veuillez vérifier l'orthographe."
            break;
        case 64:
            errorMessage = "Vous n'avez pas l'autorisation d'accéder à cette ressource."
            break;
        case 88:
            errorMessage = "Vous avez effectué trop de requêtes dernièrement, veuillez patienter quelques minutes."
            break;
        case 89:
            errorMessage = "Votre token d'identification a expiré, veuillez le renouveler."
            break;
        case 130:
            errorMessage = "Twitter est temporairement innaccessible, veuillez réessayer dans quelques minutes."
            break;
        case 131:
            errorMessage = "Une erreur inconnue est survenue, veuillez réessayer."
            break;
        case 135:
            errorMessage = "Authentification impossible, si le problème persiste, contactez le support de Twitter.\n\nerror code: " + error[0].code + " message: " + error[0].message
            break;
        case 136:
        case 179:
            errorMessage = "L'utilisateur auquel vous souhaitez accéder vous a bloqué. Impossible de terminer l'opération en cours."
            break;
        case 215:
            errorMessage = "Authentification impossible, veuillez vérifier vos informations de connexion."
            break;
        case 251:
            errorMessage = "Cette adresse ne devrait plus être utilisée. Impossible de terminer l'opération en cours."
            break;
        default:
            errorMessage = "Erreur inconnue, veuillez vous reporter à la documentation de Twitter ou contacter le support.\n\nerorr code:" + error[0].code + " message: " + error[0].message
    }
    box.setContent("\n" + errorMessage)
    screen.render()
}