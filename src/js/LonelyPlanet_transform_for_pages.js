(() => {

    //document.addEventListener('DOMContentLoaded', init);
    init();

    function init() {
        //DOM CREATION
        updateDOM();
    }

    //COMPOSE LAYOUT
    function updateDOM() {
        //STYLE
        const style = document.createElement('style');
        style.textContent = '#formatLonely {'
                                +'background: #494141;'
                                +'padding: 15px 0 50px;'
                                +'text-align: center;'
                                +'font-size: 14px;'
                            +'}'
                            +'#formatLonely textarea {'
                            +'}'
                            +'#formatLonely button {'
                                +'font-size: 18px;'
                                +'padding: 10px;'
                                +'borderRadius: 5px;'
                                +'color: #fff;'
                                +'background: #e30613;'
                            +'}'
    ;


        document.head.appendChild(style);

        //UPPER SECTION
        //input x tappe
        const leftTitle = document.createElement('div');
        leftTitle.textContent = 'Input x tappe';
        leftTitle.style.color = '#fff';
        leftTitle.style.fontSize = '24px';

        const textareaInputTappa = document.createElement('textarea');
        textareaInputTappa.id = 'formatLonely_INPUT';
        textareaInputTappa.rows = 10;
        textareaInputTappa.cols = 60;
        textareaInputTappa.addEventListener('paste', (event) => {
            setTimeout(() => {
                formatTappe();
            }, 100);
        });

        const left = document.createElement('div');
        left.appendChild(leftTitle);
        left.appendChild(textareaInputTappa);

        //buttons
        /*
        const buttonClear = document.createElement('button');
        buttonClear.textContent = 'CLEAR';
        buttonClear.addEventListener('click', clear);
        */

        const buttonTappe = document.createElement('button');
        buttonTappe.textContent = 'Formatta Tappe';
        buttonTappe.addEventListener('click', formatTappe);

        const center = document.createElement('div');
        center.style.display = 'flex';
        center.style.flexDirection = 'column';
        center.style.rowGap = '30px';
//        center.appendChild(buttonClear);
        center.appendChild(buttonTappe);
/*TODO
altri tasti???
        tasto per formattare testo che contiene solo contenuto da rimuovere i newline
*/

        //input x "solo body"
        const rightTitle = document.createElement('div');
        rightTitle.textContent = 'Input x SOLO BODY';
        rightTitle.style.color = '#fff';
        rightTitle.style.fontSize = '24px';

        const textareaInputBody = document.createElement('textarea');
        textareaInputBody.id = 'formatLonely_INPUTbody';
        textareaInputBody.rows = 10;
        textareaInputBody.cols = 60;
        textareaInputBody.addEventListener('paste', (event) => {
            setTimeout(() => {
                formatSoloBody();
            }, 100);
        });

        const right = document.createElement('div');
        right.appendChild(rightTitle);
        right.appendChild(textareaInputBody);

        //update DOM
        const upper = document.createElement('div');
        upper.style.display = 'flex';
        upper.style.alignItems = 'center';
        upper.style.justifyContent = 'center';
        upper.style.columnGap = '40px';
        upper.appendChild(left);
        upper.appendChild(center);
        upper.appendChild(right);


        //LOWER SECTION
        const textareaOutput = document.createElement('textarea');
        textareaOutput.id = 'formatLonely_OUTPUT';
        textareaOutput.rows = 10;
        textareaOutput.cols = 70;
        textareaOutput.style.background = '#d8f9ac';

        const message = document.createElement('div');
        message.id = 'formatLonely_MESSAGE';
        message.style.position = 'absolute';
        message.style.top = '0';
        message.style.right = '10px';
        message.style.backgroundColor = '#d7dfeb';
        message.style.padding = '10px';
        message.style.borderRadius = '5px';
        message.style.opacity = '0';
        message.style.transition = 'opacity 1s';

        //update DOM
        const lower = document.createElement('div');
        lower.style.position = 'relative';
        lower.appendChild(textareaOutput);
        lower.appendChild(message);

        //BACKUP SECTION
        const backupTitle = document.createElement('div');
        backupTitle.textContent = 'Backup';
        backupTitle.style.color = '#fff';
        backupTitle.style.fontSize = '16px';

        const textareaBackup = document.createElement('textarea');
        textareaBackup.id = 'formatLonely_BACKUP';
        textareaBackup.rows = 3;
        textareaBackup.cols = 20;
        textareaBackup.style.background = '#b9b0b0';

        const backup = document.createElement('div');
        backup.style.textAlign = 'left';

        backup.appendChild(backupTitle);
        backup.appendChild(textareaBackup);

        //FINALIZE
        const container = document.createElement('div');
        container.id = 'formatLonely';
        
        container.appendChild(upper);
        container.appendChild(lower);
        container.appendChild(backup);
        document.body.insertBefore(container, document.body.firstChild);
    }

    //MESSAGE
    function msg(text) {
        const m = document.getElementById('formatLonely_MESSAGE');
        m.textContent = text;
        setTimeout(() => {
            m.style.opacity = '1';
            setTimeout(() => {
                m.style.opacity = '0';
            }, 2000);
        }, 0);
    }


    //FORMATTAZIONE TAPPE
    function formatTappe() {
        const input = document.querySelector('#formatLonely_INPUT');
        const output = document.querySelector('#formatLonely_OUTPUT');
        const backup = document.querySelector('#formatLonely_BACKUP');
        const NEWLINE = '\n';
        const TAB = '\t';
        const SPACE = ' ';
        let t = '';
        let isFavorite = false;
        let title = '';
        let titleTrad = '';
        let category = '';
        let prices = '';
        let openingTimes = '';
        let url = '';
        let address = '';
        let body = '';

        /*DEBUG
        possono esserci diverse tipologie di tappe, con più o meno informazioni presenti al suo interno.
            Nelle seguenti casistiche di esempio sono stati rimosse le interlinee eseguendo la funzione removeNewLines() per riportarle su una unica riga
                //CASE 1: preferiti, title, category, address, time
                input.value = 'oChâteau de Saint-Malo CASTELLO (cartina p303; place Chateaubriand; h10-12.30 e 14-18 apr-set, 10-12 e 14-18 mar-dom ott-marzo) Lo Château de Saint-Malo fu fatto costruire dai duchi di Bretagna tra il XV e il XVI secolo e oggi ospita il Musée d’Histoire de Saint-Malo (cartina p303; %02 99 40 71 57; www.ville-saintmalo. fr/culture/les-musees; place Chateaubriand, Château de Saint-Malo; interi/bambini €6/3; h1012.30 e 14-18 apr-set, 10-12 e 14-18 mar-dom ott-marzo), un museo che illustra la vita e la storia della città. Dalla torre di vedetta del castello è possibile ammirare un magnifico panorama sulla città vecchia. Cathédrale Saint-Vincent CATTEDRALE (cartina p303; place Jean de Châtillon; h9.30-18) Il monumento più caratteristico di Saint-Malo fu costruito tra il XII e il XVIII secolo. Purtroppo la cattedrale subì danni molto gravi nel corso dei feroci combattimenti dell’agosto del 1944, quando la maggior parte della struttura originale (compresa l’alta guglia) fu distrutta dai bombardamenti. La cattedrale fu ricostruita e riconsacrata nel 1971. Una targa a mosaico collocata nel pavimento della navata indica il luogo in cui nel 1535 Jacques Cartier ricevette la benedizione del vescovo di Saint-Malo, prima di partire per il suo ‘viaggio di scoperta’ verso il Canada. '

                //CASE 2: title, category, titleTrad, URL, address, price, time
                input.value = 'Musée International du Long Cours Cap-Hornier MUSEO (Museo della Rotta di Capo Horn; cartina p300; %02 99 40 71 58; www.ville-saint-malo.fr; Tour Solidor, quai Sébastopol, Saint-Servan; interi/bambini €6/3; h10-12.30 e 14-18 tutti i giorni apr-set, 10-12 e 14-18 mar-dom ott-marzo) Ospitato all’interno della trecentesca Tour Solidor, questo museo prende in esame la vita che conducevano gli intrepidi marinai che affrontavano l’insidiosa rotta di Capo Horn, circumnavigando la punta meridionale dell’America Latina. Dalla sommità della torre è possibile ammirare uno splendido panorama. ';

                //CASE 3: title, category, address, time
                input.value = 'Fort de la Cité d’Alet FORTE (cartina p300; allée Gaston Buy, Saint-Servan; h24 h) F Costruito verso la metà del XVIII secolo, il Fort de la Cité d’Alet venne utilizzato come base logistica dai tedeschi durante la seconda guerra mondiale; uno dei bunker oggi ospita questo monumento commemorativo, che rievoca i cruenti combattimenti della seconda guerra mondiale e la liberazione di Saint-Malo. La visita di questo luogo è un’esperienza evocativa e molto commovente '

                //CASE 4: title, category, address
                input.value = 'Place de la Concorde PIAZZA (cartina p108; 8e; mConcorde) Da place de la Concorde, la più grande piazza di Parigi, potrete vedere la Tour Eiffel (p74), la Senna e gli Champs-Élysées. L’obelisco di granito rosa al centro risale a 3300 anni fa e fu donato alla Francia dall’Egitto nel 1831. Progettata nel 1755 e chiamata in origine place Louis XV in onore dell’allora re di Francia, proprio per il suo legame con la monarchia divenne il teatro principale della Rivoluzione dopo la presa della Bastiglia. Luigi XVI fu il primo a esservi ghigliottinato nel 1793. ';

                //CASE 5: title, category (ma con parentesi di informazioni)
                input.value = 'Place Vendôme PIAZZA (cartina p112; mTuileries, Opéra) Questa piazza a pianta ottagonale e gli edifici con arcate e colonnati che la circondano furono costruiti tra il 1687 e il 1721. Nel marzo 1796, nel palazzo al n. 3 furono celebrate le nozze tra Napoleone e Giuseppina, viscontessa di Beauharnais. Oggi gli edifici che si affacciano su Place Vendôme ospitano il lussuoso Hôtel Ritz Paris e alcune delle boutique più esclusive della capitale. ';

                //CASE 6: title, category (con parentesi, ma solo all'interno del body)
                input.value = 'Forêt de Chantilly FORESTA Un tempo riserva di caccia reale, i 63 kmq della Forêt de Chantilly sono attraversati da una fitta rete di sentieri percorribili a piedi e a cavallo. Tra gli itinerari a lunga percorrenza citiamo il GR11, che collega lo Château de Chantilly con la cittadina di Senlis; il GR1, che si snoda da Luzarches (famosa per la sua cattedrale, in parte risalente al XII secolo) a Ermenonville; e il GR12, che dai quattro laghetti chiamati Étangs de Commelles si dirige a nord-est verso la Forêt d’Halatte. L’ufficio turistico di Chantilly (p214) dispone di cartine e guide. ';

                //CASE 7: title, category (senza parentesi di informazioni)
                input.value = 'Forêt de Chantilly FORESTA Un tempo riserva di caccia reale, i 63 kmq della Forêt de Chantilly...';
        */

/*TODO ELIMINARE

//CASE 1: preferiti, title, category, address, time
input.value = 'oChâteau de Saint-Malo CASTELLO (cartina p303; place Chateaubriand; h10-12.30 e 14-18 apr-set, 10-12 e 14-18 mar-dom ott-marzo) Lo Château de Saint-Malo fu fatto costruire dai duchi di Bretagna tra il XV e il XVI secolo e oggi ospita il Musée d’Histoire de Saint-Malo (cartina p303; %02 99 40 71 57; www.ville-saintmalo. fr/culture/les-musees; place Chateaubriand, Château de Saint-Malo; interi/bambini €6/3; h1012.30 e 14-18 apr-set, 10-12 e 14-18 mar-dom ott-marzo), un museo che illustra la vita e la storia della città. Dalla torre di vedetta del castello è possibile ammirare un magnifico panorama sulla città vecchia. Cathédrale Saint-Vincent CATTEDRALE (cartina p303; place Jean de Châtillon; h9.30-18) Il monumento più caratteristico di Saint-Malo fu costruito tra il XII e il XVIII secolo. Purtroppo la cattedrale subì danni molto gravi nel corso dei feroci combattimenti dell’agosto del 1944, quando la maggior parte della struttura originale (compresa l’alta guglia) fu distrutta dai bombardamenti. La cattedrale fu ricostruita e riconsacrata nel 1971. Una targa a mosaico collocata nel pavimento della navata indica il luogo in cui nel 1535 Jacques Cartier ricevette la benedizione del vescovo di Saint-Malo, prima di partire per il suo ‘viaggio di scoperta’ verso il Canada. '
*/



        if (input) {t = input.value;}

        /***************************************************************************************************
        *******   EXTRACT DATA   ***************************************************************************
        ***************************************************************************************************/
        //pulizia iniziale
        t = removeNewLines(t);
        if (t.startsWith('o')) {
            isFavorite = true;
            t = t.substring(1); // Remove the first character
        }

        //search position of start info: the first sequence of characters " ("; ATTENTION: the text could contain the characters inside the body
        let separateTitleAndCategory = function(titleAndCategory){
            /*Input parameters:
                titleAndCategory    = title and category; ex: 'Place Vendôme PIAZZA'
            */
            let words = titleAndCategory.split(' ');
            for (let i = words.length - 1; i >= 0; i--) {
                if (i > 0 && /^[A-Z]+$/.test(words[i])) {
                    category = words[i] + ' ' + category;
                } else {
                    title = words.slice(0, i + 1).join(' ');
                    break;
                }
            }
            category = category.trim();
        }

        let hasTextInfo = false;
        let posStartInfo = t.search(/ \(/);
        if (posStartInfo > -1) {
            //search the category (at least a word with all letter uppercase just before the sequence " (")
            let prevWord = t.substring(0, posStartInfo).split(' ').slice(-1)[0];

            //CASE 1: preferiti, title, category, address, time
            //CASE 2: title, category, titleTrad, URL, address, price, time
            //CASE 3: title, category, address, time
            //CASE 4: title, category, address
            //CASE 5: title, category (ma con parentesi di informazioni)
            if (/^[A-Z]+$/.test(prevWord)) {
                hasTextInfo = true;
                let posStartBody = t.search(/\) /);
                if (posStartBody > -1) {
                    body = t.substring(posStartBody + 2);   //CASE 4 ex: 'Da place de la Concorde, la più grande piazza di Parigi, potrete vedere la Tour Eiffel (p74), la Senna e gli Champs-Élysées. L’obelisco di granito rosa al centro risale a 3300 anni fa e fu donato alla Francia dall’Egitto nel 1831. Progettata nel 1755 e chiamata in origine place Louis XV in onore dell’allora re di Francia, proprio per il suo legame con la monarchia divenne il teatro principale della Rivoluzione dopo la presa della Bastiglia. Luigi XVI fu il primo a esservi ghigliottinato nel 1793.'
                    t = t.substring(0, posStartBody);   //CASE 4 ex: 'Place de la Concorde PIAZZA (cartina p108; 8e; mConcorde'
                }
                let [titleAndCategory, textInfo] = t.split(' (');

                //extract title and category
                separateTitleAndCategory(titleAndCategory);

                //extract text info (title, titleTrad, URL, address, price, time)
                textInfo = textInfo.split('; ');    /*CASE 2 + other cases ex: [
                                                                    'Museo della Rotta di Capo Horn',
                                                                    'cartina p300',
                                                                    '%02 99 40 71 58',
                                                                    'www.ville-saint-malo.fr',
                                                                    'Tour Solidor, quai Sébastopol, Saint-Servan',
                                                                    'interi/bambini €6/3',
                                                                    'h10-12.30 e 14-18 tutti i giorni apr-set, 10-12 e 14-18 mar-dom ott-marzo',
                                                                    'mAlma-Marceau o RER Pont de l’Alma',
                                                                ]
                                                    */
                let elementBeforeAddress = false;
                for (let i = textInfo.length - 1; i >= 0; i--) {
                    let v = textInfo[i];

/*TODO
condizioni risolte
ok          'Museo della Rotta di Capo Horn',
ok          'cartina p300',
ok          '%02 99 40 71 58',
ok          'www.ville-saint-malo.fr',
ok          'Tour Solidor, quai Sébastopol, Saint-Servan',
ok          'interi/bambini €6/3',
            'h10-12.30 e 14-18 tutti i giorni apr-set, 10-12 e 14-18 mar-dom ott-marzo',
            'mAlma-Marceau o RER Pont de l’Alma',
condizioni da aggiungere
    autobus, ferrovia
*/


                    //map reference
                    if (v.startsWith('cartina p')) {
                        elementBeforeAddress = true;

                    //phone number
                    } else if (v.startsWith('%')) {
                        elementBeforeAddress = true;

                    //url
                    } else if (v.startsWith('http')
                    || v.startsWith('www')) {
                        url = v;
                        elementBeforeAddress = true;

                    //prices
                    } else if (v.includes('€')
                    || v.startsWith('interi/bambini')) {
/*TODO
gestire anche altre valute
*/
                        prices = v;

                    //opening times
                    } else if (v.startsWith('h')) {
/*TODO
cambiare logica
        altrimenti anche "http" soddisfa la regola
*/
                        openingTimes = v;

                    //address-titleTrad
                    } else {
                        if (address || elementBeforeAddress) {  //elements that are always before the address, or the address itself was already filled
                            titleTrad = v;
                        } else {
                            address = v;
                        }
                    }
                }
            }
        }

        //CASE 6: title, category (con parentesi, ma solo all'interno del body)
        //CASE 7: title, category (senza parentesi di informazioni)
        if (!hasTextInfo) {
            //use the first sequence of UPPERCASE words to separate title, category and body
            let words = t.split(' ');
            let i;
            for (i = 0; i < words.length; i++) {
                if (/^[A-Z]+$/.test(words[i])) {
                    break;
                }
            }
            title = words.slice(0, i).join(' ');
            for (; i < words.length; i++) {
                if (/^[A-Z]+$/.test(words[i])) {
                    category += words[i] + ' ';
                } else {
                    break;
                }
            }
            category = category.trim();
            body = words.slice(i).join(' ');
        }

        /***************************************************************************************************
        *******   COMPOSE OUTPUT   *************************************************************************
        ***************************************************************************************************/
        if (output) {
            //clean data
            title = cleanTitle(title);
            titleTrad = cleanTitleTrad(titleTrad);
            openingTimes = cleanOpeningTimes(openingTimes);
            category = cleanCategory(category);
            url = cleanUrl(url);
            address = cleanAddress(address);
            prices = cleanPrices(prices);
            body = cleanBody(body);
            if (body.startsWith('F ')) {
                prices = 'GRATUITO';
                body = body.substring(2);
            }

            //set the textarea value
            output.value = (isFavorite ? '💚' : '') + title + (titleTrad ? SPACE + '[' + titleTrad + ']' : '') + TAB + url
                            + NEWLINE + '[' + (address || 'xxx') + ']' + TAB + openingTimes
                            + NEWLINE + category + TAB + prices
                            + NEWLINE + body;

            //copy to clipboard and empty input field
            copyToClipboard(output);
            backup.value = input.value;
            input.value = '';
        }
    }



    function formatSoloBody(){
        const input = document.querySelector('#formatLonely_INPUTbody');
        const output = document.querySelector('#formatLonely_OUTPUT');
        const backup = document.querySelector('#formatLonely_BACKUP');
        let body = input.value;

        body = removeNewLines(body);
        body = cleanBody(body);

        //set the textarea value
        output.value = body;

        //copy to clipboard and empty input field
        copyToClipboard(output);
        backup.value = input.value;
        input.value = '';
    }


    function copyToClipboard(output){
        navigator.clipboard.writeText(output.value).then(() => {
            msg('Copied to clipboard');
        }).catch(err => {
            msg('Failed to copy to clipboard',err);
        });
    }


    /********************************************************************************************
    ******   FORMATTING FUNCTIONS   *************************************************************
    ********************************************************************************************/
    function removeNewLines(t){
        t = t.replace(/-\n/g, ''); // Remove hyphen followed by newline
        t = t.replace(/\n/g, ' '); // Replace remaining newlines with space
        return t;
    }
    function cleanTitle(t){
        return t;
    }
    function cleanTitleTrad(t){
        return t;
    }
    
    function cleanOpeningTimes(t){
        /*examples
                h10-12.30 e 14-18 tutti i giorni apr-set, 10-12 e 14-18 mar-dom ott-marzo
                h24 h
        */
/*TODO
raccogliere casistiche di trasformazioni necessarie
*/
        t = t.substring(1);  //remove the 'h' at the beginning
        t = t.replace('24 h', '24h');
        return t;
    }
    function cleanCategory(t){
        return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
    }
    function cleanUrl(t){
        return t.replace(/\s+/g, '');
    }
    function cleanAddress(t){
        return t;
    }
    function cleanBody(t){
/*TODO
interlinea quando c'è una separazione?
oppure si suddividerà in più copia incolla da pdf
    verificare in questo caso come viene formattato

pulizia di eventuali info all'interno del testo
        (cartina p303; %02 99 40 71 57; www.ville-saintmalo. fr/culture/les-musees; place Chateaubriand, Château de Saint-Malo; interi/bambini €6/3; h1012.30 e 14-18 apr-set, 10-12 e 14-18 mar-dom ott-marzo), 
*/
        return t;
    }
    function cleanPrices(t){
        /*examples:
                interi/bambini €6/3
        */
        const INTERI_BAMBINI = 'interi/bambini';
        if (t.startsWith(INTERI_BAMBINI)) {
            t = t.replace(INTERI_BAMBINI, '').trim()
                .split('/')[0]; //"interi/bambini €6/3" -> "€6"
        }

/*TODO
verificare casistiche di prezzi per diversi servizi della tappa
*/
        return t;
    }
    
        
})();
