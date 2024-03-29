/*


 */

 (function(window) {
   
    if (!!window.cookieChoices) {
      return window.cookieChoices;
    }
  
    var document = window.document;
    // IE8 does not support textContent, so we should fallback to innerText.
    var supportsTextContent = 'textContent' in document.body;
  
    var cookieChoices = (function() {
  
      var cookieName = 'displayCookieConsent';
      var cookieConsentId = 'cookieChoiceInfo';
      var dismissLinkId = 'cookieChoiceDismiss';
  
       //Questo crea il banner attaccato al fondo della pagina
        function _createHeaderElement(cookieText, dismissText, linkText, linkHref) {
  
          // Questo lo inseriremo direttamente nel CSS
          /*
          var butterBarStyles = 'position:fixed;width:100%;background-color:#eee;' +
              'margin:0;left:0;bottom:0;padding:4px;z-index:1000;';
          */
  
              // Questa va passata come parametro dalla masterpage.
              cookieText = 'Utilizziamo i cookie per migliorare la tua esperienza di navigazione, analizzare il traffico, pubblicare annunci e personalizzare i contenuti. Fare clic su "Accetta tutti" per acconsentire all\'utilizzo dei cookie o su "Gestisci i cookie" per modificare le impostazioni predefinite dei cookie.';
  
            var cookieContainer = document.getElementById('cookieContainer');
  
            if (!cookieContainer) {
                var cookieContainer = document.createElement('div');
                cookieContainer.id = 'cookieContainer';
            }
            else {
                cookieContainer.innerHTML = '';
            }
  
          var cookieConsentElement = document.createElement('div');
              cookieConsentElement.id = cookieConsentId;
  
          var title = document.createElement('h4');
              title.classList.add('card-title');
              title.innerHTML = '<i class="fa-solid fa-cookie-bite fa-xl text-greenVZ"></i> Gestione Cookie';
              cookieConsentElement.appendChild(title);
  
          var paragraph = document.createElement('p');
              paragraph.classList.add('card-text');
              paragraph.innerHTML = cookieText;
            cookieConsentElement.appendChild(paragraph);
  
          // Informativa Privacy.
            var anchorElement = document.createElement('a');
            console.log('_createInformationLink' + linkText + linkHref);
            anchorElement.href = _createInformationLink(linkText, linkHref);
            anchorElement.title = 'Informativa sulla privacy';
            anchorElement.innerHTML = '<strong>Informativa Privacy <i class="fa-solid fa-up-right-from-square"></i></strong>';
            cookieConsentElement.appendChild(anchorElement);
  
          var divContainer = document.createElement('div');
              divContainer.classList.add('d-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'justify-content-md-start');
  
  
            var checkboxContainer = document.createElement('div');
            checkboxContainer.id = 'GestisciCookie';
            checkboxContainer.innerHTML = '<h5>Impostazioni Cookie:</h5>';
  
            var checkboxLabels = ['Necessari', 'Preferenze', 'Statistici', 'Marketing'];
            var checkboxInputId = ['Necessary', 'Preferences', 'Statistics', 'Marketing'];
            var checkboxStates = readUserPreferencesFromCookie();
  
            console.log(checkboxStates);
  
            for (var i = 0; i < checkboxLabels.length; i++) {
                var checkboxDiv = document.createElement('div');
                checkboxDiv.classList.add('form-check', 'form-check-inline');
  
                var checkboxInput = document.createElement('input');
                checkboxInput.type = 'checkbox';
                checkboxInput.classList.add('form-check-input');
                checkboxInput.id = checkboxInputId[i];
                checkboxInput.value = 'option' + (i + 1);
                checkboxDiv.appendChild(checkboxInput);
                checkboxInput.checked = checkboxStates[i];
  
                var checkboxLabel = document.createElement('label');
                checkboxLabel.classList.add('form-check-label');
                checkboxLabel.setAttribute('for', checkboxInputId[i]);
                checkboxLabel.innerHTML = checkboxLabels[i];
                checkboxDiv.appendChild(checkboxLabel);
                
                // Impostare il primo checkbox (Necessari) come selezionato e disabilitato
                if (i === 0) {
                    checkboxInput.checked = true;
                    checkboxInput.disabled = true;
                }
  
                checkboxContainer.appendChild(checkboxDiv);
            }
  
              cookieConsentElement.appendChild(checkboxContainer);
              cookieConsentElement.appendChild(divContainer);
              cookieConsentElement.appendChild(document.createElement('hr'));
  
          // Aggiunta dei pulsanti "Rifiuto", "Accetta i selezionati", "Accetta tutti".
  
            var btnReject = document.createElement('a');
            btnReject.id = 'cookieReject';
            btnReject.classList.add('btn', 'btn-primary');
            btnReject.setAttribute('data-mdb-ripple-init', true);
            btnReject.href = '#';
            btnReject.innerHTML = 'Rifiuto';
  
            var btnAccept = document.createElement('a');
            btnAccept.id = 'cookieAccept';
            btnAccept.classList.add('btn', 'btn-primary');
            btnAccept.setAttribute('data-mdb-ripple-init', true);
            btnAccept.href = '#';
            btnAccept.innerHTML = 'Accetta i selezionati';
  
            var btnAcceptAll = document.createElement('a');
            btnAcceptAll.id = 'cookieAcceptAll';
            btnAcceptAll.classList.add('btn', 'btn-primary');
            btnAcceptAll.setAttribute('data-mdb-ripple-init', true);
            btnAcceptAll.href = '#';
            btnAcceptAll.innerHTML = 'Accetta tutti';
  
            cookieConsentElement.appendChild(btnReject);
            cookieConsentElement.appendChild(btnAccept);
            cookieConsentElement.appendChild(btnAcceptAll);
  
            cookieContainer.appendChild(cookieConsentElement);
            // Imposto il valore dei checkbox basandomi sul cookie salvato
            readUserPreferencesFromCookie();
  
            return cookieContainer;
      }
  
  
      function _createDialogElement(cookieText, dismissText, linkText, linkHref) {
        var glassStyle = 'position:fixed;width:100%;height:100%;z-index:999;' +
            'top:0;left:0;opacity:0.5;filter:alpha(opacity=50);' +
            'background-color:#ccc;';
        var dialogStyle = 'z-index:1000;position:fixed;left:50%;top:50%';
        var contentStyle = 'position:relative;left:-50%;margin-top:-25%;' +
            'background-color:#fff;padding:20px;box-shadow:4px 4px 25px #888;';
  
        var cookieConsentElement = document.createElement('div');
          cookieConsentElement.id = cookieConsentId;
  
        var glassPanel = document.createElement('div');
          glassPanel.style.cssText = glassStyle;
  
        var content = document.createElement('div');
          content.style.cssText = contentStyle;
  
        var dialog = document.createElement('div');
          dialog.style.cssText = dialogStyle;
  
        var dismissLink = _createDismissLink(dismissText);
        dismissLink.style.display = 'block';
        dismissLink.style.textAlign = 'right';
        dismissLink.style.marginTop = '8px';
  
        content.appendChild(_createConsentText(cookieText));
        if (!!linkText && !!linkHref) {
          content.appendChild(_createInformationLink(linkText, linkHref));
        }
        content.appendChild(dismissLink);
        dialog.appendChild(content);
        cookieConsentElement.appendChild(glassPanel);
        cookieConsentElement.appendChild(dialog);
        return cookieConsentElement;
      }
  
      function _setElementText(element, text) {
        if (supportsTextContent) {
          element.textContent = text;
        } else {
          element.innerText = text;
        }
      }
  
      function _createConsentText(cookieText) {
        var consentText = document.createElement('span');
        _setElementText(consentText, cookieText);
        return consentText;
      }
  
      function _createDismissLink(dismissText) {
        var dismissLink = document.createElement('a');
        _setElementText(dismissLink, dismissText);
        dismissLink.id = dismissLinkId;
        dismissLink.href = '#';
        dismissLink.style.marginLeft = '24px';
        return dismissLink;
      }
  
      function _createInformationLink(linkText, linkHref) {
        var infoLink = document.createElement('a');
        _setElementText(infoLink, linkText);
        infoLink.href = linkHref;
        infoLink.target = '_blank';
        infoLink.style.marginLeft = '8px';
        return infoLink;
      }
  
        function _dismissLinkClick() {
            console.log('Rifiuto Click!');
          _saveUserPreference();
          _removeCookieConsent();
        return false;
        }
  
        function _rejectClick() {
            console.log('Rifiuto!');
            _saveUserPreference(false);
            _removeCookieConsent();
            return false;
        }
  
        function _acceptClick() {
            console.log('Accetto solo i selezionati!');
            _saveUserPreference();
            _removeCookieConsent();
            return false;
        }
  
        function _acceptAllClick() {
            console.log('Accetto tutto!');
            _saveUserPreference(true);
            _removeCookieConsent();
            return false;
        }
  
      function _showCookieConsent(cookieText, dismissText, linkText, linkHref, isDialog) {
        if (_shouldDisplayConsent()) {
          _removeCookieConsent();
          var consentElement = (isDialog) ?
          _createDialogElement(cookieText, dismissText, linkText, linkHref) :
          _createHeaderElement(cookieText, dismissText, linkText, linkHref);
          
          var fragment = document.createDocumentFragment();
          fragment.appendChild(consentElement);
          document.body.appendChild(fragment.cloneNode(true));
          
          //document.getElementById(dismissLinkId).onclick = _dismissLinkClick;
          console.log('_showCokieConsent');
          document.getElementById('cookieReject').onclick = _rejectClick;
          document.getElementById('cookieAccept').onclick = _acceptClick;
          document.getElementById('cookieAcceptAll').onclick = _acceptAllClick;
        }
        else {        
            _addCookieSetup();
        }
      }
  
        function _reopenCookieClick(cookieText, dismissText, linkText, linkHref, isDialog) {
  
            console.log('reopenCokieClick!');
                var consentElement = (isDialog) ?
                    _createDialogElement(cookieText, dismissText, linkText, linkHref) :
                    _createHeaderElement(cookieText, dismissText, linkText, linkHref);
  
                var fragment = document.createDocumentFragment();
                fragment.appendChild(consentElement);
                document.body.appendChild(fragment.cloneNode(true));
  
                //document.getElementById(dismissLinkId).onclick = _dismissLinkClick;
                console.log('_showCokieConsent');
                document.getElementById('cookieReject').onclick = _rejectClick;
                document.getElementById('cookieAccept').onclick = _acceptClick;
                document.getElementById('cookieAcceptAll').onclick = _acceptAllClick;
        }
  
      function showCookieConsentBar(cookieText, dismissText, linkText, linkHref) {
        _showCookieConsent(cookieText, dismissText, linkText, linkHref, false);
      }
  
      function showCookieConsentDialog(cookieText, dismissText, linkText, linkHref) {
        _showCookieConsent(cookieText, dismissText, linkText, linkHref, true);
      }
  
      function _removeCookieConsent() {
          var cookieChoiceElement = document.getElementById(cookieConsentId);
          //var cookieChoiceElement = document.getElementById('cookieContainer');
        if (cookieChoiceElement != null) {
            cookieChoiceElement.parentNode.removeChild(cookieChoiceElement);
            _addCookieSetup();
        }
      }
    
        function _addCookieSetup(cookieText, dismissText, linkText, linkHref) {
            var updateCookiesLink = document.getElementById('updateCookies');
            var cookieContainer = document.getElementById('cookieContainer');
  
            // Verifica se l'elemento updateCookiesLink non esiste già
            if (!updateCookiesLink) {
                // Se l'elemento non esiste già, crealo e aggiungilo
                if (!cookieContainer) {
                var cookieContainer = document.createElement('div');
                cookieContainer.id = 'cookieContainer';
            }
  
                var fragment = document.createDocumentFragment();
                fragment.appendChild(cookieContainer);
                document.body.appendChild(fragment.cloneNode(true));
  
                updateCookiesLink = document.createElement('a');
                updateCookiesLink.href = '#';
                updateCookiesLink.id = 'updateCookies';
                updateCookiesLink.className = 'updateCookies';
                updateCookiesLink.title = 'Gestisci i Cookie';
                updateCookiesLink.appendChild(document.createTextNode('Gestisci i Cookie'));
  
                document.getElementById('cookieContainer').appendChild(updateCookiesLink);
            } else {
                // Se l'elemento già esiste, non fare nulla
                console.log("L'elemento 'updateCookies' è già presente.");
            }
            /*
            document.getElementById('updateCookies').onclick = _reopenCookieClick;
            */
            document.getElementById('updateCookies').onclick = function () {
                _reopenCookieClick(cookieText, dismissText, linkText, 'Sito/nexp/ITA/ITA/ContName/NotaCookies/navigation.htm',false);
            };
        }
  
      function _saveUserPreference(checkedValue) {
        // Set the cookie expiry to one year after today.
        var expiryDate = new Date();
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  
          var checkboxNecessari = document.getElementById('Necessary').checked;
          var checkboxPreferences = document.getElementById('Preferences').checked;
          var checkboxStatistici = document.getElementById('Statistics').checked;
          var checkboxMarketing = document.getElementById('Marketing').checked;
  
          if (checkedValue === true) {
              console.log('accetto tutto');
              checkboxNecessari = true;
              checkboxPreferences = true;
              checkboxStatistici = true;
              checkboxMarketing = true;
          } else if (checkedValue === false) {
              console.log('rifiuto tutto');
              checkboxNecessari = false;
              checkboxPreferences = false;
              checkboxStatistici = false;
              checkboxMarketing = false;
          }
  
  
          var cookieContent = 'necessary:' + checkboxNecessari + ',preferences:' + checkboxPreferences + ',statistics:' + checkboxStatistici + ',marketing:' + checkboxMarketing;
          document.cookie = cookieName + '=' + cookieContent + '; expires=' + expiryDate.toGMTString();
      }
  
        function readUserPreferencesFromCookie() {
            //var cookieName = 'userPreferences'; // Assumi che questo sia il nome del cookie usato nella funzione _saveUserPreference()
  
            var userPreferences = [false, false, false, false]; // Inizializza un array di booleani per le preferenze
  
            if (document.cookie.indexOf(cookieName) !== -1) { // Verifica se il cookie esiste
                var cookies = document.cookie.split(';');
  
                // Cerca il cookie corrispondente
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i].trim();
                    if (cookie.indexOf(cookieName) === 0) {
                        var cookieContent = cookie.substring(cookie.indexOf('=') + 1);
                        var preferencesArray = cookieContent.split(',');
  
                        // Parsing delle preferenze dal cookie
                        for (var j = 0; j < preferencesArray.length; j++) {
                            var preference = preferencesArray[j].split(':');
                            switch (preference[0]) {
                                case 'necessary':
                                    userPreferences[0] = preference[1] === 'true';
                                    break;
                                case 'preferences':
                                    userPreferences[1] = preference[1] === 'true';
                                    break;
                                case 'statistics':
                                    userPreferences[2] = preference[1] === 'true';
                                    break;
                                case 'marketing':
                                    userPreferences[3] = preference[1] === 'true';
                                    break;
                            }
                        }
                        break;
                    }
                }
            }
            return userPreferences;
        }
  
      function _shouldDisplayConsent() {
        // Display the header only if the cookie has not been set.
        return !document.cookie.match(new RegExp(cookieName + '=([^;]+)'));
      }
  
      var exports = {};
      exports.showCookieConsentBar = showCookieConsentBar;
      exports.showCookieConsentDialog = showCookieConsentDialog;
      return exports;
    })();
  
    window.cookieChoices = cookieChoices;
    return cookieChoices;
  })(this);
  