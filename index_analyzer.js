#!/usr/bin/env node
const program = require('commander')

program
    .version('0.0.1')
    .usage('None yet ;)')
    .description('None yet ;)')
        // basics search criteria
    .option('-w, --word <word(s)>', 'Recherche tous les tweets contenant ce(s) mot(s)')
    .option('-p, --phrase <phrase>', 'Recherche tous les tweets contenant cette phrase')
    .option('-o, --or <words>', 'Recherche tous les tweets contenant l\'un ou l\'autre de ces mots')
    .option('-H, --hashtag <hashtag(s)>', 'Recherche tous les tweets contenant ce(s) hashtag(s)')
    .option('-f, --from <account>', 'Recherche tous les tweets provenant de cette personne', /^@?(\w){1,15}$/i)
    .option('-t, --to <account>', 'Recherche tous les tweets adressés à cette personne', /^@?(\w){1,15}$/i)
    .option('-a, --at <account>', 'Recherche tous les tweets mentionnant cette personne', /^@?(\w){1,15}$/i)
        // basics search filters
    .option('-n, --not <word(s)>', 'Filtre tous les tweets ne contenant ce(s) mot(s)')
    .option('-s, --safe', 'Filtre tous les tweets considérés comme sensibles')
    .option('-m, --media', 'Filtre tous les tweets contenant un média (image, vidéo, etc.)')
    .option('-v, --video', 'Filtre tous les tweets contenant une vidéo (vidéo native, Periscope, Vine, etc.')
    .option('-P, --periscope', 'Filtre tous les tweets contenant une vidéo Periscope')
    .option('-V, --vine', 'Filtre tous les tweets contenant une vidéo Vine')
    .option('-i, --image', 'Filtre tous les tweets contenant une image')
    .option('-T, --twimg', 'Filtre tous les tweets contenant une image pic.twitter.com')
    .option('-l, --link', 'Filtre tous les tweets contenant un lien')
        // advanced search filters
    //.option('-S, --since <YYYY-MM-DD>', 'Filtre les tweets posté depuis une certaine date (format YYYY-MM-DD)', /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/i)
    .option('-S, --since <YYYY-MM-DD>', 'Filtre les tweets posté depuis une certaine date (format YYYY-MM-DD)')
    //.option('-U, --until <YYYY-MM-DD>', 'Filtre les tweets posté avant une certaine date (format YYYY-MM-DD)', /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/i)
    .option('-U, --until <YYYY-MM-DD>', 'Filtre les tweets posté avant une certaine date (format YYYY-MM-DD)')
    .option('-A, --attitude <positive|negative>', 'Filtre les tweets suivant l\'appréciation souhaité', /^(positive|negative)$/i, 'positive')
    .option('-q, --question', 'Filtre les tweets posant une question')
    //.option('-g, --geocode <XX.XXXX,YY.YYYY,Zkm|Zmi>', 'Filtre les tweets suivant une position GPS', /^(\-?\d{1,3}(\.\d{1,5})?),\s*(\-?\d{1,3}(\.\d{1,5})?),\s*\d+(km|mi)$/i)
    .option('-g, --geocode <XX.XXXX,YY.YYYY,Zkm|Zmi>', 'Filtre les tweets suivant une position GPS')
    .option('-L, --lang <country\'s iso code>', 'Filtre les tweets selon la langue utilisée', /^(AF|AX|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|KH|CM|CA|CV|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SZ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW)$/i)
    .option('-r, --result-type <mixed|recent|popular', 'Filtre les tweets en fonction du type souhaité (récents, populaires, mixtes)', /^(mixed|recent|popular)$/i, 'mixed')

program.parse(process.argv)

// search criteria treatement
// Note: only one criteria can be used, so the first valid criteria will be used
if (program.word) {
    console.log('Criteria word:', program.word)
} else if (program.phrase) {
    console.log('Criteria phrase:', program.phrase)
} else if (program.or) {
    console.log('Criteria or:', program.or)
} else if (program.hashtag) {
    console.log('Criteria hashtag:', program.hashtag)
} else if (program.from) {
    console.log('Criteria from:', program.from)
} else if (program.to) {
    console.log('Criteria to:', program.to)
} else if (program.at) {
    console.log('Criteria at:', program.at)
} else {
    console.error('ERR > no criteria selected! You need to selected one criteria')
}

// basic filter
// Note: only one basic filter can be used, so the first valid filter will be used
if (program.not) {
    console.log('Filter not:', program.not)
} else if (program.safe) {
    console.log('Filter safe:', true)
} else if (program.media) {
    console.log('Filter media:', true)
} else if (program.video) {
    console.log('Filter video:', true)
} else if (program.periscope) {
    console.log('Filter periscope:', true)
} else if (program.vine) {
    console.log('Filter vine:', true)
} else if (program.image) {
    console.log('Filter image:', true)
} else if (program.twimg) {
    console.log('Filter twimg:', true)
} else if (program.link) {
    console.log('Filter link:', true)
}

// advanced filter
if (program.since) {
    console.log('Filter since:', program.since)
}
if (program.until) {
    console.log('Filter until:', program.until)
}
if (program.attitude) {
    console.log('Filter attitude:', program.attitude)
}
if (program.question) {
    console.log('Filter question:', true)
}
if (program.geocode) {
    console.log('Filter geocode:', program.geocode)
}
if (program.lang) {
    console.log('Filter lang:', program.lang)
}
if (program.resultType) {
    console.log('Filter result-type:', program.resultType)
}