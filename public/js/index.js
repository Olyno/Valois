document.addEventListener('DOMContentLoaded', () => {

    async function becomeActive(elem, newElem) {
        if (states[elem].last !== newElem) {
            newElem.classList.add('is-active');
            states[elem].last.classList.remove('is-active');
            states[elem].last = newElem;
        }
    }

    async function changePullColor(newColor) {
        const { currentPull } = states;
        data.pull.color = newColor;
        currentPull.setAttribute('src', 'images/pull/' + newColor + '/' + data.pull.position + '.png');
        window.localStorage.setItem('pull_color', newColor);
    }

    async function changePullPosition(newPosition) {
        const { currentPull } = states;
        data.pull.position = newPosition;
        currentPull.setAttribute('src', 'images/pull/' + data.pull.color + '/' + newPosition + '.png');
        window.localStorage.setItem('pull_position', newPosition);
    }

    async function addMotif(imgData) {
        const preview = document.querySelector('.preview');
        const copyMotif = imgData.image.element.cloneNode(true);
        const motifId = data.motifs.size;
        copyMotif.style.position = 'absolute';
        copyMotif.style.width = imgData.image.element.width + 'px';
        copyMotif.style.height = imgData.image.element.height + 'px';
        copyMotif.style.top = '40%';
        copyMotif.style.left = '40%';
        preview.appendChild(copyMotif);
        data.motifs.set(motifId, {
            width: copyMotif.style.width || 0,
            height: copyMotif.style.height || 0,
            rotate: '0deg',
            top: copyMotif.style.top || 0,
            bottom: copyMotif.style.bottom || 0,
            left: copyMotif.style.left || 0,
            right: copyMotif.style.right || 0
        });
        const motif = new Moveable(preview, {
            target: copyMotif,
            container: preview,
            draggable: true,
            resizable: true,
            rotatable: true,
            origin: true,
            keepRatio: true,
            edge: false,
            throttleDrag: 0,
            throttleResize: 0,
            throttleScale: 0,
            throttleRotate: 0,
        });

        motif.on('resize', ({ target, width, height, delta }) => {
            delta[0] && (target.style.width = `${width}px`);
            delta[1] && (target.style.height = `${height}px`);
            data.motifs.get(motifId).width = width;
            data.motifs.get(motifId).height = height;
        });

        motif.on('rotate', ({ target, transform, rotate }) => {
            target.style.transform = transform;
            data.motifs.get(motifId).rotate = rotate;
        })

        motif.on('drag', ({ target, left, top, right, bottom }) => {
            if (left > 0 && top > 0 && right > 0 && bottom > 0) {
                target.style.left = `${left}px`;
                target.style.top = `${top}px`;
                data.motifs.get(motifId).top = top;
                data.motifs.get(motifId).bottom = bottom;
                data.motifs.get(motifId).left = left;
                data.motifs.get(motifId).right = right;
            }
        })
    }

    async function sendDesign() {
        document.querySelector('.customization').style.display = 'none';
        document.querySelector('.sendForm').style.display = 'flex';
        document.querySelector('.sendForm form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = Array.from(e.target.elements).map(v => {
                return { name: v.name, value: v.value }
            });
            console.log(e.target.elements)
            fetch('/designs/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pull: data.pull,
                    motifs: [...data.motifs],
                    userData: { formData, login: data.userId }
                })
            })
            .then((newUser) => {
                
            })
            .catch(console.error)
        })
    }

    const userId = Math.random().toString(36).substring(6);

    const data = {
        userId: window.localStorage.getItem('userId') || window.localStorage.setItem('userId', userId) && userId,
        pull: {
            position: window.localStorage.getItem('pull_position') || 'body_front',
            color: window.localStorage.getItem('pull_color') || 'blue',
            motifs: [
                'images/logo.svg',
                'images/banner_info.svg',
                'images/banner.svg'
            ]
        },
        motifs: new Map()
    }

    const states = {
        currentPull: document.querySelector('.preview .currentPull'),
        selections: {
            last: document.querySelector('.selections button.is-active')
        },
        colors: {
            last: document.querySelector('.editions section.color div.is-active')
        },
        positions: {
            last: document.querySelector('.editions section.position div.is-active')
        }
    }

    if (data.pull.color) {
        states.currentPull.setAttribute('src', 'images/pull/' + data.pull.color + '/' + data.pull.position + '.png');
        becomeActive('colors', document.querySelector('.editions section.color div[data-color="' + data.pull.color + '"]'));
    }

    // ==================== HIDE SECTIONS  ====================
    for (const section of document.querySelectorAll('.editions section')) {
        section.style.display = states.selections.last.dataset.selector === section.dataset.selector ?
            '' : 'none';
    }

    // ==================== SELECTORS FOR EDITION  ====================
    for (const selector of document.querySelectorAll('.selections button')) {
        selector.addEventListener('click', () => {
            for (const section of document.querySelectorAll('.editions section')) {
                if (selector.dataset.selector === section.dataset.selector) {
                    section.style.display = '';
                    if (selector.dataset.selector === 'position') {
                        for (const img of document.querySelectorAll('.editions section.position div')) {
                            document.querySelector('.editions section.position div[data-position=' + img.dataset.position + '] img')
                                .setAttribute('src', 'images/pull/' + data.pull.color + '/' + img.dataset.position + '.png');
                        }
                    } else if (selector.dataset.selector === 'motif') {
                        const motifs = section.querySelector('.motifs');
                        motifs.innerHTML = '';
                        for (const img of data.pull.motifs) {
                            const imageElement = document.createElement('img');
                            const imageSelectButton = document.createElement('button');
                            const imageContainer = document.createElement('div');
                            imageElement.setAttribute('src', img);
                            imageSelectButton.textContent = 'Choisir';
                            imageSelectButton.classList.add('is-simple', 'is-select');
                            imageContainer.appendChild(imageElement);
                            imageContainer.appendChild(imageSelectButton);
                            motifs.appendChild(imageContainer);
                            imageSelectButton.addEventListener('click', () => {
                                addMotif({
                                    url: img,
                                    image: {
                                        element: imageElement,
                                        container: {
                                            element: imageContainer
                                        }
                                    }
                                });
                            })
                        }
                    }
                } else {
                    section.style.display = 'none'
                }
                if (selector.dataset.selector === 'validate') {
                    sendDesign();
                    break;
                }
            }
            becomeActive('selections', selector);
        })
    }

    // ==================== EDITION COLORS ====================
    for (const colorButton of document.querySelectorAll('.editions section.color div')) {
        colorButton.addEventListener('click', () => {
            changePullColor(colorButton.dataset.color);
            becomeActive('colors', colorButton);
        })
    }

    // ==================== EDITION DOWNLOAD ====================
    const downloadButton = document.querySelector('.editions section.download button');
    downloadButton.addEventListener('click', () => {
        const fileInput = document.querySelector('.editions section.download input[type="file"]');
        const downloadPreview = document.querySelector('.editions section.download .downloadPreview');
        const cancelDownloadPreview = document.querySelector('.editions section.download .downloadPreview p');
        fileInput.click();
        fileInput.addEventListener('change', (e) => {
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.addEventListener('load', (e) => {
                data.pull.motifs.push(e.target.result);
                downloadPreview.querySelector('img').setAttribute('src', e.target.result);
                downloadPreview.style.display = 'block';
                cancelDownloadPreview.addEventListener('click', () => {
                    downloadPreview.style.display = 'none';
                })
            })
        })
    })

    // ==================== EDITION POSITION ====================
    for (const positionButton of document.querySelectorAll('.editions section.position div')) {
        positionButton.addEventListener('click', () => {
            changePullPosition(positionButton.dataset.position);
            becomeActive('positions', positionButton);
        })
    }

    // ==================== EDITION ZOOM ====================
    for (const zoomButton of document.querySelectorAll('.editions section.zoom button')) {
        zoomButton.addEventListener('click', () => {
            let zoom = '200';
            if (zoomButton.dataset.zoom === 'out') zoom = '100';
            states.currentPull.style.width = zoom + '%';
            states.currentPull.style.height = zoom + '%';
        })
    }

    // ==================== EDITION RESTART ====================
    document.querySelector('.editions section.restart button').addEventListener('click', () => {
        window.localStorage.clear();
        location.reload();
    })

})