
let headings = document.querySelectorAll(".card > h2");
const autocompleteInput = document.getElementById('dawa-autocomplete-input');
const options = {
    select: function (selected) {
        autocompleteInput.value = selected.tekst;
    }
};
const autocomplete = dawaAutocomplete.dawaAutocomplete(autocompleteInput, options);

function fetchBuildingData() {
    const address = encodeURIComponent(autocompleteInput.value);
    const rawAddress = autocompleteInput.value;
    //  console.log(rawAddress);

    fetch(`https://api.dataforsyningen.dk/adresser?q=${address}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                const adresseid = data[0].id; // Get the id from the first returned address

                fetch(`https://api.dataforsyningen.dk/bbrlight/enheder?adresseid=${adresseid}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(buildingData => {
                        if (buildingData.length > 0) {
                            console.log(buildingData);

                            let insideArea = buildingData[0].BEBO_ARL;
                            let rooms = buildingData[0].VAERELSE_ANT;
                            let bathrooms = buildingData[0].AntBadevaerelser;
                            let toilets = buildingData[0].AntVandskylToilleter;
                            let build = buildingData[0].bygning.OPFOERELSE_AAR;
                            let reBuild = buildingData[0].bygning.OMBYG_AAR;
                            // let planes = buildingData[0].bygning.ETAGER_ANT;
                            let heating = buildingData[0].bygning.VARMEINSTAL_KODE;
                            let use = buildingData[0].ENH_ANVEND_KODE;
                            let wall = buildingData[0].bygning.YDERVAEG_KODE;
                            let roof = buildingData[0].bygning.TAG_KODE;

                            let roofTypes = {
                                "1": "Fladt tag",
                                "2": "Tagpap",
                                "3": "Fibercement",
                                "4": "Cementsten",
                                "5": "Tegl",
                                "6": "Metalplader",
                                "7": "Stråtag",
                                "10": "Fibercement",
                                "11": "PVC",
                                "12": "Glas"
                            };

                            let wallTypes = {
                                "1": "Mursten",
                                "2": "Letbeton",
                                "3": "Fibercement",
                                "4": "Bindingsværk",
                                "5": "Træbeklædning",
                                "6": "Betonelementer",
                                "8": "Metalplader",
                                "10": "Fibercement",
                                "11": "PVC",
                                "12": "Glas"
                            };

                            let useTypes = {
                                "110": "Stuehus til landbrugsejendom",
                                "120": "Parcelhus",
                                "130": "Rækkehus",
                                "140": "Lejlighed",
                                "510": "Sommerhus",
                                "540": "Kolonihave"
                            };

                            let heatingTypes = {
                                "1": "Fjernvarme",
                                "2": "Centralvarme",
                                "3": "Ovne",
                                "5": "Varmepumpe",
                                "6": "Centralvarme med to fyringsenheder",
                                "7": "Elovne",
                                "8": "Gasradiatorer",
                                "9": "Ingen varmeinstallationer"
                            };

                            let buildingText = "";

                            if (use !== null && useTypes.hasOwnProperty(use)) {
                                use = useTypes[use];
                                buildingText += "Boligtype: " + use + ". ";
                            }

                            if (insideArea !== null) {
                                buildingText += "Boligareal: " + insideArea + ". ";
                            }

                            if (rooms !== null) {
                                if (rooms <= 2) {
                                    buildingText += "Værelser i alt: " + rooms + ". ";
                                }
                                else {
                                    rooms = rooms - 1;
                                    buildingText += "Stue: 1. Værelser: " + rooms + ". ";
                                }
                            }

                            if (bathrooms !== null) {
                                buildingText += "Badeværelser: " + bathrooms + ". ";
                            }

                            if (toilets !== null && toilets > bathrooms) {
                                toilets = toilets - bathrooms;
                                buildingText += "Toiletter: " + toilets + ". ";
                            }

                            if (build !== null) {
                                buildingText += "Byggeår: " + build + ". ";
                            }

                            if (reBuild !== null && reBuild !== 0) {
                                buildingText += "Ombygget: " + reBuild + ". ";
                            }

                            if (roof !== null && roofTypes.hasOwnProperty(roof)) {
                                roof = roofTypes[roof];
                                buildingText += "Tag: " + roof + ". ";
                            }

                            if (wall !== null && wallTypes.hasOwnProperty(wall)) {
                                wall = wallTypes[wall];
                                buildingText += "Ydervægge: " + wall + ". ";
                            }

                            if (heating !== null && heatingTypes.hasOwnProperty(heating)) {
                                heating = heatingTypes[heating];
                                buildingText += "Varme: " + heating + ". ";
                            }

                            const reason1 = document.getElementById('reason1').value;
                            const reason2 = document.getElementById('reason2').value;
                            const reason3 = document.getElementById('reason3').value;

                            // Writing style start
                            let writingStyle;
                            let styleExample;
                            let styleType;
                            const writingStyleElements = document.getElementsByName('writingStyle');

                            for (let i = 0; i < writingStyleElements.length; i++) {
                                if (writingStyleElements[i].checked) {
                                    writingStyle = writingStyleElements[i].value;
                                    break;
                                }
                            }

                            let systemMessage;
                            if (writingStyle === 'style1') {
                                styleExample = 'Med en attraktiv beliggenhed centralt i Virum finder I denne lyse lejlighed, der foruden den bedste placering i bebyggelsen kan bryste sig af et lyst og stilrent indre samt en skøn, solrig altan.\nLejligheden er gennemgående moderniseret i 2015, og fremstår overalt i flot og indflytningsklar stand. Blandt andet kan nævnes, at der er hvidmalet glasfilt på vægge og lofter samt massivt parketgulv i alle rum.\nPå badeværelset er indretningen optimeret, ligesom der er lagt fliser med gulvvarme, mens HTH-køkkenet er udført i hvid højglans med induktionskogeplade og nedfældet vask. Ikke mindst er der isat ekstra el-, antenne- og internetstik i alle rum samt ført el til altanen. ';
                                styleType = 'Tør og saglig. Ikke malende beskrivelser.';
                            } else if (writingStyle === 'style2') {
                                styleExample = 'Drømmer I om et vaskeægte håndværkertilbud, som I selv kan indrette, istandsætte og sætte jeres aftryk på? Så er denne ældre villa i Ellerup nær Gudbjerg måske noget for jer. Med nøglerne til Jydevej 9, kan I slippe kreativiteten løs og skræddersy jeres nye hjem i tråd med jeres personlige stil og præferencer.\nEn ting står dog ikke til at ændre, og det er den fantastiske placering i naturskønne omgivelser med udsigt til åbne marker. Fra huset har I under 300 meter til det nærmeste busstoppested, mens en køretur på mindre end tre kilometer bringer jer til indkøb, Stokkebækskolen og daginstitution i Gudbjerg.';
                                styleType = 'Beskrivende, men ikke malende.';
                            } else if (writingStyle === 'style3') {
                                styleExample = 'Sukker I længselsfuldt efter et hjem i New Yorker-stil, eller har mange timers scrollen på Instagrams polerede boligprofiler fået jer til at drømme om et nyt hus? Så er denne byggegrund på 610 kvadratmeter i den gamle del af Herfølge værd at kigge nærmere på. Udover muligheden for at lade kreativiteten få frit spil, så venter her en hverdag i trygge rammer med alt hvad I har brug for i nærområdet.';
                                styleType = 'Meget malende og kreativ.';
                            }   


                            console.log("Inspiration: " + styleType);

                            // Writing style end

                            generateDescription(buildingText, rawAddress, reason1, reason2, reason3,);
                        } else {
                            document.getElementById('result').innerHTML = 'No building information found for this address.';
                        }
                    })
                    .catch(error => {
                        console.error('There has been a problem with your fetch operation:', error);
                    });

            } else {
                document.getElementById('result').innerHTML = 'No address found';
            }
        })

        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

async function generateDescription(buildingText, rawAddress, reason1, reason2, reason3, styleExample, styleType, options = {}) {

    // Show loading status
    document.getElementById('dataLoadingStatus').classList.add('active');
    document.getElementById('resultLoadingStatus').classList.add('active');
    // document.getElementById('changeLoadingStatus').classList.add('active');


    try {

        var url = 'https://api.openai.com/v1/chat/completions';

        var data = {
            model: 'gpt-4',
            messages: [
                { 'role': 'system', 'content': `Du er en hjælpsom assistent, der skriver boligsalgstekster.` },
                { 'role': 'user', 'content': `Vi har en ejendom beliggende på ${rawAddress}. Bygningsdata er som følger: ${buildingText}.` },
                { 'role': 'user', 'content': `Her er tre gode grunde til at købe boligen: 1. ${reason1} 2. ${reason2} 3. ${reason3}` },
                { 'role': 'user', 'content': `Skrivestilen skal være: ${styleType} Et eksempel til inspiration (kun stil - IKKE indhold) kunne være følgende: ${styleExample}` },
                { 'role': 'user', 'content': `Generér en salgstekst i den beskrevne skrivestil på ca. 1000 tegn. Benyt kun bygningsdata, der er relevante ift. købsgrundene.` }
            ],
            temperature: 0.7,
            max_tokens: 600
        };

        var response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify(data)
        });

        // Hide all cards except the "resultCard" 
        headings.forEach(h2 => {
            let sibling = h2.nextElementSibling;
            if (h2.parentNode.id !== "resultCard") {
                while (sibling) {
                    sibling.classList.add("hidden");
                    sibling = sibling.nextElementSibling;
                }
            } else {
                // Explicitly unhide all content under h2 tag in the "resultCard"
                while (sibling) {
                    sibling.classList.remove("hidden");
                    sibling = sibling.nextElementSibling;
                }
            }
        });

        // Extract the generated description from the response
        const responseData = await response.json();

        let description = responseData.choices[0].message.content;
        console.log(description);

        // Update the result element with the generated description
        const resultTextarea = document.getElementById('result');
        //  const changesTextarea = document.getElementById('changes');
        resultTextarea.value = description;

        // Hide loading status
        document.getElementById('dataLoadingStatus').classList.remove('active');
        document.getElementById('resultLoadingStatus').classList.remove('active');
        // document.getElementById('changeLoadingStatus').classList.remove('active');

        // Auto adjust height of the textarea
        autoAdjustHeight(resultTextarea);
        //   autoAdjustHeight(changesTextarea);

    } catch (error) {
        console.error('There has been a problem with the API request:', error);

        // Hide loading status
        document.getElementById('dataLoadingStatus').classList.remove('active');
        document.getElementById('resultLoadingStatus').classList.remove('active');
        //  document.getElementById('changeLoadingStatus').classList.remove('active');
    }
}


function applyChanges() {
    const changes = document.getElementById('changes').value;
    const result = document.getElementById('result').value;
    const newPrompt = "Du skal optimere salgsteksten for en bolig. I den nye version skal du sikre dig at: " + changes + ". Den oprindelige tekst er: " + result;
    console.log("newPrompt: " + newPrompt);
    generateDescription(newPrompt);  // Pass the new prompt to your function
}

function copyToClipboard() {
    const textarea = document.getElementById('result');
    textarea.select();
    document.execCommand('copy');
}

function autoAdjustHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    textarea.style.minHeight = '16px';
}

// Call this function whenever the text content changes
// For instance, on page load and whenever the user inputs text
window.onload = function () {
    var textareas = document.getElementsByTagName('textarea');
    for (let i = 0; i < textareas.length; i++) {
        autoAdjustHeight(textareas[i]);
        textareas[i].addEventListener('input', function () {
            autoAdjustHeight(this);
        }, false);
    }

    headings.forEach(heading => {
        heading.addEventListener("click", function () {
            let sibling = this.nextElementSibling;
            while (sibling) {
                sibling.classList.toggle("hidden");
                sibling = sibling.nextElementSibling;
            }
        });
    });

    // Initially hide all content under h2 tags, except for #dataCard
    headings.forEach(h2 => {
        if (h2.parentNode.id !== "dataCard") {
            let sibling = h2.nextElementSibling;
            while (sibling) {
                sibling.classList.add("hidden");
                sibling = sibling.nextElementSibling;
            }
        }
    });

};
