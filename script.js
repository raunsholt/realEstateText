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
                                    const insideArea = buildingData[0].bygning.BYG_BOLIG_ARL_SAML;
                                    const rooms = buildingData[0].VAERELSE_ANT;
                                    const toilets = buildingData[0].AntVandskylToilleter;
                                    const bathrooms = buildingData[0].AntBadevaerelser;
                                    const build = buildingData[0].bygning.OPFOERELSE_AAR;
                                    let reBuild = buildingData[0].bygning.OMBYG_AAR;
                                    const planes = buildingData[0].bygning.ETAGER_ANT;
                                    /*  To find
                                      const basement = 
                                      const energyRating = 
                                      const totalArea = 
                                      */
                                    let buildingInfo = insideArea + " kvadratmeter bolig, " + rooms + " værelser, " + toilets + " toiletter, " + bathrooms + " badeværelser, opført i " + build + ", " + planes + " etager";
                                    if (reBuild != 0) {
                                        buildingInfo = buildingInfo.concat(", ombygget i " + reBuild);
                                    }
                                    const reasons = document.getElementById('reasons-input').value;
                                    const promptText = "Du skal skrive en inspirerende boligbeskrivelse på ca. 1000 tegn for boligen " + rawAddress + ". Læg vægt på følgende: " + reasons + ". Data om boligen er: " + buildingInfo + ".";
                                    console.log("promptText: " + promptText);
                                    // Generate real estate description using ChatGPT API
                                    generateDescription(promptText);
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

        async function generateDescription(promptText, options = {}) {
            // Show loading status
            document.getElementById('dataLoadingStatus').classList.add('active');
            document.getElementById('resultLoadingStatus').classList.add('active');

            try {
                var url = 'https://api.openai.com/v1/chat/completions';

                var data = {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'Du er en hjælpsom ejendomsmægler og tekstforfatter' },
                        { role: 'user', content: `${promptText}` }
                    ],
                    temperature: 0.7,
                    max_tokens: 400
                };

                var response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer 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'
                    },
                    body: JSON.stringify(data)
                });

                // Extract the generated description from the response
                const responseData = await response.json();

                let description = responseData.choices[0].message.content;
                console.log(description);

                // Update the result element with the generated description
                const resultTextarea = document.getElementById('result');
                const changesTextarea = document.getElementById('changes');
                resultTextarea.value = description;

                // Hide loading status
                document.getElementById('dataLoadingStatus').classList.remove('active');
                document.getElementById('resultLoadingStatus').classList.remove('active');

                // Show the result card now that we have a result
                document.getElementById('resultCard').style.display = 'block';

                // Auto adjust height of the textarea
                autoAdjustHeight(resultTextarea);
                autoAdjustHeight(changesTextarea);

            } catch (error) {
                console.error('There has been a problem with the API request:', error);

                // Hide loading status
                document.getElementById('dataLoadingStatus').classList.remove('active');
                document.getElementById('resultLoadingStatus').classList.remove('active');
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
        };