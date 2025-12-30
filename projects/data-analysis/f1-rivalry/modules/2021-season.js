export default async function init2021Season() {
    const BASE_URL = 'https://api.jolpi.ca/ergast/f1/2021';

    // Elements
    const hamPointsElement = document.getElementById('ham-points');
    const verPointsElement = document.getElementById('ver-points');
    const tableBody = document.querySelector('#races-table tbody');
    const tableHead = document.querySelector('#races-table thead tr');
    const ctx = document.getElementById('championshipChart').getContext('2d');
    const sessionSelect = document.getElementById('session-select');

    // New Stats Elements
    const hamAvgPosEl = document.getElementById('ham-avg-pos');
    const verAvgPosEl = document.getElementById('ver-avg-pos');
    const hamMedianPosEl = document.getElementById('ham-median-pos');
    const verMedianPosEl = document.getElementById('ver-median-pos');
    const distCtx = document.getElementById('distributionChart').getContext('2d');
    const gapCtx = document.getElementById('gapChart').getContext('2d');

    let chartInstance = null;
    let distChartInstance = null;
    let gapChartInstance = null;

    // Initial Load
    await loadData('race');

    // Event Listener
    if (sessionSelect) {
        sessionSelect.addEventListener('change', (e) => loadData(e.target.value));
    }

    async function loadData(sessionType) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Loading...</td></tr>';

        // Update Title
        const titleElement = document.getElementById('results-title');
        if (titleElement) {
            if (sessionType === 'race') titleElement.textContent = 'Race Results';
            else if (sessionType === 'qualifying') titleElement.textContent = 'Qualifying Results';
            else if (sessionType === 'sprint') titleElement.textContent = 'Sprint Results';
        }

        try {
            let endpointBase = '';
            if (sessionType === 'race') endpointBase = '/results.json';
            else if (sessionType === 'qualifying') endpointBase = '/qualifying.json';
            else if (sessionType === 'sprint') endpointBase = '/sprint.json';

            // Pagination Logic
            let allRaces = [];
            let offset = 0;
            const limit = 100;
            let hasMore = true;

            while (hasMore) {
                const response = await fetch(`${BASE_URL}${endpointBase}?limit=${limit}&offset=${offset}`);
                if (!response.ok) throw new Error(`API Error: ${response.status}`);

                const data = await response.json();
                const races = data.MRData.RaceTable.Races;

                if (races.length > 0) {
                    allRaces = allRaces.concat(races);
                    offset += limit;

                    const total = parseInt(data.MRData.total);
                    if (offset >= total) {
                        hasMore = false;
                    }
                } else {
                    hasMore = false;
                }
            }

            if (allRaces.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No data found for this session type.</td></tr>';
                return;
            }

            // Consolidate Races
            const mergedRaces = [];
            const raceMap = new Map();

            allRaces.forEach(race => {
                const round = race.round;
                if (!raceMap.has(round)) {
                    raceMap.set(round, race);
                    mergedRaces.push(race);
                } else {
                    const existingRace = raceMap.get(round);
                    if (sessionType === 'race' && race.Results) {
                        existingRace.Results = (existingRace.Results || []).concat(race.Results);
                    } else if (sessionType === 'qualifying' && race.QualifyingResults) {
                        existingRace.QualifyingResults = (existingRace.QualifyingResults || []).concat(race.QualifyingResults);
                    } else if (sessionType === 'sprint' && race.SprintResults) {
                        existingRace.SprintResults = (existingRace.SprintResults || []).concat(race.SprintResults);
                    }
                }
            });

            // Clear Table
            tableBody.innerHTML = '';
            updateTableHeader(sessionType);

            let hamTotal = 0;
            let verTotal = 0;
            const labels = [];
            const hamData = [];
            const verData = [];

            // Stats Arrays
            const hamPositions = [];
            const verPositions = [];
            const gapData = []; // + for HAM faster, - for VER faster

            mergedRaces.forEach(race => {
                let hamResult, verResult;

                if (sessionType === 'race') {
                    hamResult = race.Results ? race.Results.find(r => r.Driver.code === 'HAM') : null;
                    verResult = race.Results ? race.Results.find(r => r.Driver.code === 'VER') : null;
                } else if (sessionType === 'qualifying') {
                    hamResult = race.QualifyingResults ? race.QualifyingResults.find(r => r.Driver.code === 'HAM') : null;
                    verResult = race.QualifyingResults ? race.QualifyingResults.find(r => r.Driver.code === 'VER') : null;
                } else if (sessionType === 'sprint') {
                    hamResult = race.SprintResults ? race.SprintResults.find(r => r.Driver.code === 'HAM') : null;
                    verResult = race.SprintResults ? race.SprintResults.find(r => r.Driver.code === 'VER') : null;
                }

                // Process Points / Positions for Chart
                const hamPts = hamResult && hamResult.points ? parseFloat(hamResult.points) : 0;
                const verPts = verResult && verResult.points ? parseFloat(verResult.points) : 0;

                if (sessionType === 'race' || sessionType === 'sprint') {
                    hamTotal += hamPts;
                    verTotal += verPts;
                } else {
                    hamTotal = hamResult ? parseInt(hamResult.position) : 20;
                    verTotal = verResult ? parseInt(verResult.position) : 20;
                }

                labels.push(race.raceName.replace(' Grand Prix', ''));
                hamData.push(hamTotal);
                verData.push(verTotal);

                // Collect Stats
                if (hamResult && hamResult.position) hamPositions.push(parseInt(hamResult.position));
                if (verResult && verResult.position) verPositions.push(parseInt(verResult.position));

                // Render Row
                const row = document.createElement('tr');
                const hamPos = hamResult ? hamResult.position : '-';
                const verPos = verResult ? verResult.position : '-';

                // Diff (Points)
                let diffStr = '';
                let diffClass = '';

                if (sessionType === 'race' || sessionType === 'sprint') {
                    const diff = verTotal - hamTotal;
                    diffClass = diff > 0 ? 'redbull-text' : (diff < 0 ? 'mercedes-text' : '');
                    diffStr = diff > 0 ? `+${diff.toFixed(1)} VER` : (diff < 0 ? `+${Math.abs(diff).toFixed(1)} HAM` : '0');
                } else {
                    diffStr = '-';
                }

                // Time Gap Calculation
                let gapStr = '-';
                let gapClass = '';
                let gapValue = null; // For Chart

                if (hamResult && verResult) {
                    const hamTime = getRawTime(hamResult, sessionType);
                    const verTime = getRawTime(verResult, sessionType);

                    if (hamTime && verTime) {
                        let hamMillis = parseMillis(hamTime);
                        let verMillis = parseMillis(verTime);

                        if (hamMillis !== null && verMillis !== null) {
                            const diffMillis = verMillis - hamMillis;
                            const absDiff = Math.abs(diffMillis);
                            const formattedGap = formatGap(absDiff);

                            // For Chart: + means HAM faster (VER took longer), - means VER faster
                            // diffMillis = VER - HAM. 
                            // If > 0, VER > HAM (VER slower), so HAM advantage.
                            gapValue = diffMillis / 1000; // Seconds

                            if (diffMillis > 0) { // VER > HAM => HAM is faster
                                gapStr = `+${formattedGap} HAM`;
                                gapClass = 'mercedes-text';
                            } else if (diffMillis < 0) { // VER < HAM => VER is faster
                                gapStr = `+${formattedGap} VER`;
                                gapClass = 'redbull-text';
                            } else {
                                gapStr = 'Equal';
                            }
                        }
                        // Fallback for Qualy strings "1:20.123"
                        else if (typeof hamTime === 'string' && typeof verTime === 'string' && hamTime.includes(':')) {
                            const h = parseLapTime(hamTime);
                            const v = parseLapTime(verTime);
                            if (h && v) {
                                const d = v - h;
                                const fd = formatGap(Math.abs(d));
                                gapValue = d / 1000; // Seconds

                                if (d > 0) { gapStr = `+${fd} HAM`; gapClass = 'mercedes-text'; }
                                else { gapStr = `+${fd} VER`; gapClass = 'redbull-text'; }
                            }
                        }
                    } else {
                        // Handle DNF/Status cases
                        if (!hamResult.Time && !verResult.Time) gapStr = '-';
                        else if (!hamResult.Time) { gapStr = 'VER Finished'; gapClass = 'redbull-text'; }
                        else if (!verResult.Time) { gapStr = 'HAM Finished'; gapClass = 'mercedes-text'; }
                    }
                }
                gapData.push(gapValue);

                // Extra Data (Time Display)
                const hamTimeDisplay = getTimeDisplay(hamResult, sessionType);
                const verTimeDisplay = getTimeDisplay(verResult, sessionType);

                row.innerHTML = `
                    <td>${race.round}</td>
                    <td>${race.raceName}</td>
                    <td class="${hamPos === '1' ? 'mercedes-text' : ''}">${hamPos} <small>(${hamTimeDisplay})</small></td>
                    <td class="${verPos === '1' ? 'redbull-text' : ''}">${verPos} <small>(${verTimeDisplay})</small></td>
                    <td class="${gapClass}" style="font-weight:bold;">${gapStr}</td>
                    <td class="${diffClass}">${diffStr}</td>
                `;
                tableBody.appendChild(row);
            });

            // Update Charts
            updateChart(labels, hamData, verData, sessionType);
            updateStats(hamPositions, verPositions);
            updateDistributionChart(hamPositions, verPositions, sessionType);
            updateGapChart(labels, gapData, sessionType);

            // Always show total points
            hamPointsElement.textContent = "387.5";
            verPointsElement.textContent = "395.5";

        } catch (error) {
            console.error("Error fetching data:", error);
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #ef4444;">Error loading data. Please try again later.<br><small>${error.message}</small></td></tr>`;
        }
    }

    function updateStats(hamPos, verPos) {
        const calcAvg = (arr) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : '-';
        const calcMedian = (arr) => {
            if (!arr.length) return '-';
            const sorted = [...arr].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            return sorted.length % 2 !== 0 ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1);
        };

        if (hamAvgPosEl) hamAvgPosEl.textContent = calcAvg(hamPos);
        if (verAvgPosEl) verAvgPosEl.textContent = calcAvg(verPos);
        if (hamMedianPosEl) hamMedianPosEl.textContent = calcMedian(hamPos);
        if (verMedianPosEl) verMedianPosEl.textContent = calcMedian(verPos);
    }

    function updateDistributionChart(hamPos, verPos, sessionType) {
        if (distChartInstance) distChartInstance.destroy();

        // Calculate frequency of positions 1-20
        const getFreq = (arr) => {
            const counts = Array(20).fill(0);
            arr.forEach(p => { if (p >= 1 && p <= 20) counts[p - 1]++; });
            return counts;
        };

        const hamFreq = getFreq(hamPos);
        const verFreq = getFreq(verPos);
        const labels = Array.from({ length: 20 }, (_, i) => `P${i + 1}`);

        const titleText = sessionType === 'qualifying' ? 'Qualifying Position Distribution' :
            (sessionType === 'sprint' ? 'Sprint Finish Position Distribution' : 'Race Finish Position Distribution');

        distChartInstance = new Chart(distCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Hamilton',
                        data: hamFreq,
                        backgroundColor: 'rgba(0, 210, 190, 0.6)',
                        borderColor: '#00d2be',
                        borderWidth: 1
                    },
                    {
                        label: 'Verstappen',
                        data: verFreq,
                        backgroundColor: 'rgba(6, 0, 239, 0.6)',
                        borderColor: '#0600ef',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: 'white' } },
                    title: { display: true, text: titleText, color: '#a0a0a0', font: { size: 14 } }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#a0a0a0', stepSize: 1 },
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        title: { display: true, text: 'Frequency', color: '#a0a0a0' }
                    },
                    x: {
                        ticks: { color: '#a0a0a0' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    function updateGapChart(labels, gapData, sessionType) {
        if (gapChartInstance) gapChartInstance.destroy();

        const titleText = sessionType === 'qualifying' ? 'Qualifying Gap Evolution (Seconds)' :
            (sessionType === 'sprint' ? 'Sprint Gap Evolution (Seconds)' : 'Race Gap Evolution (Seconds)');

        gapChartInstance = new Chart(gapCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Gap (Seconds) - Positive = HAM Faster',
                    data: gapData,
                    backgroundColor: gapData.map(v => v > 0 ? 'rgba(0, 210, 190, 0.6)' : 'rgba(6, 0, 239, 0.6)'),
                    borderColor: gapData.map(v => v > 0 ? '#00d2be' : '#0600ef'),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: titleText, color: '#a0a0a0', font: { size: 14 } },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const v = ctx.raw;
                                return v > 0 ? `HAM Faster by ${v.toFixed(3)}s` : `VER Faster by ${Math.abs(v).toFixed(3)}s`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        title: { display: true, text: 'Gap (Seconds)', color: '#a0a0a0' },
                        ticks: { color: '#a0a0a0' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    x: {
                        ticks: { display: true, color: '#a0a0a0', maxRotation: 90, minRotation: 45, autoSkip: false, font: { size: 10 } },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    function updateTableHeader(sessionType) {
        if (sessionType === 'qualifying') {
            tableHead.innerHTML = `
                <th>Round</th>
                <th>Grand Prix</th>
                <th class="mercedes-text">Hamilton (Q3)</th>
                <th class="redbull-text">Verstappen (Q3)</th>
                <th>Gap</th>
                <th>Diff</th>
            `;
        } else {
            tableHead.innerHTML = `
                <th>Round</th>
                <th>Grand Prix</th>
                <th class="mercedes-text">Hamilton</th>
                <th class="redbull-text">Verstappen</th>
                <th>Gap</th>
                <th>Diff (Cum.)</th>
            `;
        }
    }

    function getRawTime(result, type) {
        if (!result) return null;
        if (type === 'qualifying') return result.Q3 || result.Q2 || result.Q1 || null;
        if (type === 'race' || type === 'sprint') {
            if (result.Time && result.Time.millis) return result.Time.millis;
            if (result.Time && result.Time.time) return result.Time.time;
            return null;
        }
        return null;
    }

    function getTimeDisplay(result, type) {
        if (!result) return '-';
        if (type === 'qualifying') return result.Q3 || result.Q2 || result.Q1 || 'No Time';
        if (type === 'race' || type === 'sprint') return result.Time ? result.Time.time : (result.status || 'Finished');
        return '-';
    }

    function parseMillis(val) {
        if (!val) return null;
        if (!isNaN(val)) return parseInt(val);
        return null;
    }

    function parseLapTime(timeStr) {
        try {
            const parts = timeStr.split(':');
            let seconds = 0;
            if (parts.length === 2) {
                seconds += parseInt(parts[0]) * 60;
                seconds += parseFloat(parts[1]);
            } else {
                seconds += parseFloat(parts[0]);
            }
            return seconds * 1000;
        } catch (e) { return null; }
    }

    function formatGap(millis) {
        const sec = Math.floor(millis / 1000);
        const ms = Math.floor(millis % 1000);
        return `${sec}.${ms.toString().padStart(3, '0')}s`;
    }

    function updateChart(labels, hamData, verData, type) {
        if (chartInstance) chartInstance.destroy();

        const isQualy = type === 'qualifying';

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Lewis Hamilton',
                        data: hamData,
                        borderColor: '#00d2be',
                        backgroundColor: 'rgba(0, 210, 190, 0.1)',
                        tension: 0.4,
                        fill: !isQualy,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Max Verstappen',
                        data: verData,
                        borderColor: '#0600ef',
                        backgroundColor: 'rgba(6, 0, 239, 0.1)',
                        tension: 0.4,
                        fill: !isQualy,
                        yAxisID: 'y'
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        labels: { color: 'white' }
                    }
                },
                scales: {
                    y: {
                        reverse: isQualy, // Invert for position (1 is top)
                        title: { display: true, text: isQualy ? 'Position' : 'Points', color: '#a0a0a0' },
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: '#a0a0a0' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#a0a0a0', maxRotation: 90, minRotation: 45 }
                    }
                }
            }
        });
    }
}
