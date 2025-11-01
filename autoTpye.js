let targetWPM = parseInt(prompt("[AlanDev] Please enter the target wpm (max 150, default 120)"), 10);

if (isNaN(targetWPM)) targetWPM = 120;
if (targetWPM > 150) targetWPM = 150;

const avgDelay = 60000 / (targetWPM * 5);

const minDelay = avgDelay * 0.8;
const maxDelay = avgDelay * 1.2;

let running = false;

const keyOverrides = {
    [String.fromCharCode(160)]: ' '
};

function getTargetCharacters() {
    if (document.querySelector('.token span.token_unit')) {
        const els = Array.from(document.querySelectorAll('.token span.token_unit'));
        const chrs = els.map(el => {
            if (el.firstChild?.classList?.contains('_enter')) {
                return '\n';
            }
            let text = el.textContent[0];
            return text;
        }).map(c => keyOverrides.hasOwnProperty(c) ? keyOverrides[c] : c);
        return chrs;
    } else if (window.core?.words?.[0]?.char_list) {
        return core.words[0].char_list.map(c => c.chr);
    }
}

function recordKey(chr) {
    window.core.record_keydown_time(chr);
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function clickContinue() {
    await sleep(500);
    const continueButton = document.querySelector('button[aria-label="Continue"]');
    if (continueButton) {
        continueButton.click();
    }
    await sleep(1000);
}

async function autoPlay(finish) {
    running = finish;
    while (running) {
        if (document.querySelector('div.edmodal-x')) {
            const closeBtn = document.querySelector('div.edmodal-x');
            if (closeBtn) {
                closeBtn.click();
            }
            continue;
        }
        if (document.querySelector('video')) {
            const video = document.querySelector("video.vjs-tech");
            if (video) {
                video.currentTime = Math.max(0, video.duration - 0.1);
                video.dispatchEvent(new Event("ended"));
            }
        }
        const chrs = getTargetCharacters();
        // console.log(chrs);
        if (chrs && chrs.length > 0) {
            await sleep(500);
            for (let i = 0; i < chrs.length - (!finish); ++i) {
                const c = chrs[i];
                recordKey(c);
                await sleep(Math.random() * (maxDelay - minDelay) + minDelay);
            }
        }
        await clickContinue();
    }
}

autoPlay(true);


