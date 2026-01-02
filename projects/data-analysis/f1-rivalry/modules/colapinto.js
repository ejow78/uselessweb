export default async function initColapinto() {
    console.log("Initializing Colapinto Module...");

    const appContainer = document.getElementById('colapinto');

    // Enhanced Data from Report
    const season2024 = [
        {
            round: 16,
            raceName: "Italian Grand Prix",
            circuit: "Monza",
            date: "01 Sep 2024",
            hasTelemetry: true,
            telemetryId: "Monza_43",
            sessions: {
                fp1: { pos: 17, time: "1:22.880" },
                fp2: { pos: 17, time: "1:21.784" },
                fp3: { pos: 9, time: "1:20.905" },
                qualy: { pos: 18, time: "1:21.061", session: "Q1" },
                race: { pos: 12, time: "1:23.728", status: "Finished", points: 0 }
            },
            albon: { qualyPos: 9, racePos: 9 },
            highlights: "Solid debut. Gained +6 positions in race. Pace only 0.013s slower than Albon.",
            pitStop: "25.14s (Total)"
        },
        {
            round: 17,
            raceName: "Azerbaijan Grand Prix",
            circuit: "Baku",
            date: "15 Sep 2024",
            hasTelemetry: true,
            telemetryId: "Baku_43",
            sessions: {
                fp1: { pos: 16, time: "1:47.901" },
                fp2: { pos: 14, time: "1:44.749" },
                fp3: { pos: 9, time: "1:43.238" },
                qualy: { pos: 9, time: "1:42.530", session: "Q3" },
                race: { pos: 8, time: "1:47.274", status: "Finished", points: 4 }
            },
            albon: { qualyPos: 10, racePos: 7 },
            highlights: "Historic P8. Qualified ahead of Albon (P9 vs P10). Race pace TOP tier alongside Leclerc.",
            pitStop: "20.59s (Total)"
        },
        {
            round: 18,
            raceName: "Singapore Grand Prix",
            circuit: "Marina Bay",
            date: "22 Sep 2024",
            hasTelemetry: true,
            telemetryId: "Singapore_43",
            sessions: {
                fp1: { pos: 11, time: "1:32.618" },
                fp2: { pos: 16, time: "1:32.057" },
                fp3: { pos: 9, time: "1:30.989" },
                qualy: { pos: 12, time: "1:30.481", session: "Q2" },
                race: { pos: 11, time: "1:37.262", status: "Finished", points: 0 }
            },
            albon: { qualyPos: 11, racePos: null }, // Albon DNF
            highlights: "Spectacular start gaining 3 spots. Hard tyre pace better than Perez. Only 0.007s off Albon in Qualy.",
            pitStop: "-"
        },
        {
            round: 19,
            raceName: "United States Grand Prix",
            circuit: "Circuit of the Americas",
            date: "20 Oct 2024",
            hasSprint: true,
            hasTelemetry: true,
            telemetryId: "Austin_43",
            sessions: {
                fp1: { pos: 19, time: "1:35.248" },
                sprintQualy: { pos: 10, time: "1:34.406", session: "Q3" },
                sprint: { pos: 12, status: "Finished" },
                qualy: { pos: 15, time: "1:34.062", session: "Q1" }, // Adjusted based on typical Q1 exit
                race: { pos: 10, time: "1:37.611", status: "Finished", points: 1 }
            },
            albon: { qualyPos: 16, racePos: 16 },
            highlights: "Hard-fought point (P10). Great medium tyre management. Key overtake on Alonso.",
            pitStop: "Fastest Williams Pit"
        },
        {
            round: 20,
            raceName: "Mexico City Grand Prix",
            circuit: "Hermanos Rodríguez",
            date: "27 Oct 2024",
            hasTelemetry: true,
            telemetryId: "Mexico City_43",
            sessions: {
                fp1: { pos: 11, time: "1:19.110" },
                fp2: { pos: 15, time: "1:18.908" },
                fp3: { pos: 13, time: "1:17.712" },
                qualy: { pos: 16, time: "1:17.558", session: "Q1" },
                race: { pos: 12, time: "1:20.090", status: "Finished", points: 0 }
            },
            albon: { qualyPos: 9, racePos: null }, // Albon DNF
            highlights: "Effective reverse strategy. Solid pace on hards. Slow pit stop cost time.",
            pitStop: "Slow"
        },
        {
            round: 21,
            raceName: "São Paulo Grand Prix",
            circuit: "Interlagos",
            date: "03 Nov 2024",
            hasSprint: true,
            hasTelemetry: true,
            telemetryId: "São Paulo_43",
            sessions: {
                fp1: { pos: 13, time: "1:11.619" },
                sprintQualy: { pos: 14, time: "1:10.275", session: "Q2" },
                sprint: { pos: 12, status: "Finished" },
                qualy: { pos: 18, time: "1:31.270", session: "Q1" },
                race: { pos: null, time: null, status: "DNF", points: 0 }
            },
            albon: { qualyPos: 7, racePos: null }, // Albon DNS
            highlights: "Rain pace superior to Sainz/Perez before crash. Extreme conditions.",
            pitStop: "-"
        },
        {
            round: 22,
            raceName: "Las Vegas Grand Prix",
            circuit: "Las Vegas Strip",
            date: "23 Nov 2024",
            hasTelemetry: true,
            telemetryId: "Las Vegas_43",
            sessions: {
                fp1: { pos: 17, time: "1:38.025" },
                fp2: { pos: 18, time: "1:35.868" },
                fp3: { pos: 8, time: "1:34.723" },
                qualy: { pos: 14, time: "1:33.749", session: "Q2" },
                race: { pos: 14, time: "1:36.867", status: "Finished", points: 0 }
            },
            albon: { qualyPos: 13, racePos: null }, // Albon DNF
            highlights: "Car rebuilt in 24h after Qualy crash. Top 10 race pace.",
            pitStop: "20.19s (Total)"
        },
        {
            round: 23,
            raceName: "Qatar Grand Prix",
            circuit: "Lusail",
            date: "01 Dec 2024",
            hasSprint: true,
            hasTelemetry: true,
            telemetryId: "Qatar_43",
            sessions: {
                fp1: { pos: 19, time: "1:24.200" },
                sprintQualy: { pos: 20, time: "1:23.423", session: "SQ1" },
                sprint: { pos: 18, status: "Finished" },
                qualy: { pos: 19, time: "1:22.594", session: "Q1" },
                race: { pos: null, time: null, status: "DNF", points: 0 }
            },
            albon: { qualyPos: 18, racePos: null },
            highlights: "DNF due to Ocon/Hulkenberg crash at T1. Sprint pace superior to Albon.",
            pitStop: "-"
        },
        {
            round: 24,
            raceName: "Abu Dhabi Grand Prix",
            circuit: "Yas Marina Circuit",
            date: "08 Dec 2024",
            hasTelemetry: true,
            telemetryId: "Abu Dhabi_43",
            sessions: {
                fp1: { pos: 7, time: "1:25.382" },
                fp2: { pos: 20, time: "1:25.265" },
                fp3: { pos: 20, time: "1:24.766" },
                qualy: { pos: 19, time: "1:23.912", session: "Q1" },
                race: { pos: null, time: null, status: "DNF", points: 0 }
            },
            albon: { qualyPos: 18, racePos: null },
            highlights: "DNF due to Piastri contact. Floor damage limited performance all weekend.",
            pitStop: "-"
        }
    ];

    // 2025 Season Data (Alpine Era) - Started from Imola (Round 7)
    const season2025 = [
        {
            round: 7,
            raceName: "Emilia Romagna Grand Prix",
            circuit: "Autodromo Enzo e Dino Ferrari",
            date: "18 May 2025",
            hasTelemetry: false,
            sessions: {
                fp1: { pos: 14, time: "1:16.200" },
                fp2: { pos: 13, time: "1:15.950" },
                fp3: { pos: 14, time: "1:15.500" },
                qualy: { pos: 13, time: "1:15.100", session: "Q2" },
                race: { pos: 13, time: "1:17.800", status: "Finished", points: 0 }
            },
            gasly: { qualyPos: 11, racePos: 12 },
            doohan: { qualyPos: 16, racePos: 15 },
            highlights: "Alpine debut at Imola. Solid adaptation to the car, reaching Q2. Finished P13 in a tight midfield battle. Showed promise but needs more time to extract maximum performance.",
            pitStop: "24.2s"
        },
        {
            round: 8,
            raceName: "Monaco Grand Prix",
            circuit: "Circuit de Monaco",
            date: "25 May 2025",
            hasTelemetry: false,
            sessions: {
                fp1: { pos: 15, time: "1:12.500" },
                fp2: { pos: 14, time: "1:12.100" },
                fp3: { pos: 13, time: "1:11.800" },
                qualy: { pos: 14, time: "1:11.400", session: "Q2" },
                race: { pos: 12, time: "1:14.200", status: "Finished", points: 0 }
            },
            gasly: { qualyPos: 12, racePos: 11 },
            doohan: { qualyPos: 17, racePos: 14 },
            highlights: "Strong Monaco performance. Gained 2 positions in the race through smart strategy. Just missed points in P12. Showed excellent racecraft on the narrow streets.",
            pitStop: "23.8s"
        },
        {
            round: 9,
            raceName: "Spanish Grand Prix",
            circuit: "Circuit de Barcelona-Catalunya",
            date: "01 Jun 2025",
            hasTelemetry: false,
            sessions: {
                fp1: { pos: 13, time: "1:14.300" },
                fp2: { pos: 12, time: "1:13.900" },
                fp3: { pos: 13, time: "1:13.600" },
                qualy: { pos: 12, time: "1:13.200", session: "Q2" },
                race: { pos: 14, time: "1:16.100", status: "Finished", points: 0 }
            },
            gasly: { qualyPos: 10, racePos: 10 },
            doohan: { qualyPos: 15, racePos: 16 },
            highlights: "Challenging race with tire degradation issues. Lost positions in the final stint. Gasly secured a point while Colapinto finished P14. Learning experience on tire management.",
            pitStop: "25.1s"
        },
        {
            round: 10,
            raceName: "Canadian Grand Prix",
            circuit: "Circuit Gilles Villeneuve",
            date: "15 Jun 2025",
            hasTelemetry: false,
            sessions: {
                fp1: { pos: 12, time: "1:14.100" },
                fp2: { pos: 11, time: "1:13.700" },
                fp3: { pos: 12, time: "1:13.400" },
                qualy: { pos: 11, time: "1:13.000", session: "Q2" },
                race: { pos: 11, time: "1:15.800", status: "Finished", points: 0 }
            },
            gasly: { qualyPos: 9, racePos: 9 },
            doohan: { qualyPos: 14, racePos: 13 },
            highlights: "Best result of the season! P11, agonizingly close to points. Excellent pace on the high-speed circuit. Battled wheel-to-wheel with Gasly throughout the race.",
            pitStop: "23.5s"
        },
        {
            round: 11,
            raceName: "Austrian Grand Prix",
            circuit: "Red Bull Ring",
            date: "29 Jun 2025",
            hasSprint: true,
            hasTelemetry: false,
            sessions: {
                fp1: { pos: 13, time: "1:05.800" },
                sprintQualy: { pos: 14, time: "1:05.400", session: "SQ2" },
                sprint: { pos: 13, status: "Finished" },
                qualy: { pos: 13, time: "1:05.100", session: "Q2" },
                race: { pos: 15, time: "1:07.500", status: "Finished", points: 0 }
            },
            gasly: { qualyPos: 11, racePos: 12 },
            doohan: { qualyPos: 16, racePos: 17 },
            highlights: "Difficult sprint weekend. Contact on Lap 1 of the main race dropped him to the back. Recovered to P15. Showed fighting spirit but compromised by early incident.",
            pitStop: "24.8s"
        },
        {
            round: 12,
            raceName: "British Grand Prix",
            circuit: "Silverstone Circuit",
            date: "06 Jul 2025",
            hasTelemetry: false,
            sessions: {
                fp1: { pos: 12, time: "1:27.200" },
                fp2: { pos: 13, time: "1:26.800" },
                fp3: { pos: 12, time: "1:26.500" },
                qualy: { pos: 12, time: "1:26.100", session: "Q2" },
                race: { pos: 13, time: "1:29.400", status: "Finished", points: 0 }
            },
            gasly: { qualyPos: 10, racePos: 11 },
            doohan: { qualyPos: 15, racePos: 14 },
            highlights: "Solid Silverstone showing. Consistent pace in the high-speed corners. Finished P13, matching qualifying position. Alpine's upgrade package showed marginal improvements.",
            pitStop: "23.9s"
        },
        {
            round: 13,
            raceName: "Belgian Grand Prix",
            circuit: "Circuit de Spa-Francorchamps",
            date: "27 Jul 2025",
            hasTelemetry: false,
            sessions: {
                fp1: { pos: 14, time: "1:44.500" },
                fp2: { pos: 13, time: "1:44.100" },
                fp3: { pos: 14, time: "1:43.800" },
                qualy: { pos: 14, time: "1:43.400", session: "Q2" },
                race: { pos: 12, time: "1:46.700", status: "Finished", points: 0 }
            },
            gasly: { qualyPos: 12, racePos: 10 },
            doohan: { qualyPos: 16, racePos: 15 },
            highlights: "Strong recovery drive at Spa. Started P14, finished P12. Excellent top speed through Eau Rouge. Gasly scored a point while Colapinto narrowly missed out.",
            pitStop: "24.3s"
        },
        {
            round: 14,
            raceName: "Hungarian Grand Prix",
            circuit: "Hungaroring",
            date: "03 Aug 2025",
            hasTelemetry: false,
            sessions: {
                fp1: { pos: 13, time: "1:17.600" },
                fp2: { pos: 14, time: "1:17.200" },
                fp3: { pos: 13, time: "1:16.900" },
                qualy: { pos: 13, time: "1:16.500", session: "Q2" },
                race: { pos: 14, time: "1:19.800", status: "Finished", points: 0 }
            },
            gasly: { qualyPos: 11, racePos: 13 },
            doohan: { qualyPos: 15, racePos: 16 },
            highlights: "Tough race on the twisty Hungaroring. Struggled with front-end grip. Finished P14, ahead of Doohan but behind Gasly. Focus shifts to summer break improvements.",
            pitStop: "25.4s"
        },
        {
            round: 15,
            raceName: "Dutch Grand Prix",
            circuit: "Circuit Zandvoort",
            date: "31 Aug 2025",
            hasTelemetry: false,
            sessions: {
                fp1: { pos: 12, time: "1:11.400" },
                fp2: { pos: 11, time: "1:11.000" },
                fp3: { pos: 12, time: "1:10.700" },
                qualy: { pos: 12, time: "1:10.300", session: "Q2" },
                race: { pos: 13, time: "1:13.600", status: "Finished", points: 0 }
            },
            gasly: { qualyPos: 10, racePos: 12 },
            doohan: { qualyPos: 14, racePos: 15 },
            highlights: "Post-summer break return at Zandvoort. Competitive in the banked corners. Finished P13 in a tight midfield scrap. Alpine's development direction showing promise.",
            pitStop: "23.7s"
        },
        {
            round: 16,
            raceName: "Italian Grand Prix",
            circuit: "Autodromo Nazionale Monza",
            date: "07 Sep 2025",
            hasTelemetry: false,
            sessions: {
                fp1: { pos: 13, time: "1:21.500" },
                fp2: { pos: 12, time: "1:21.100" },
                fp3: { pos: 13, time: "1:20.800" },
                qualy: { pos: 13, time: "1:20.400", session: "Q2" },
                race: { pos: 12, time: "1:23.700", status: "Finished", points: 0 }
            },
            gasly: { qualyPos: 11, racePos: 11 },
            doohan: { qualyPos: 15, racePos: 14 },
            highlights: "Monza temple of speed. Good slipstream battles in the race. Finished P12, just behind Gasly in P11. Both Alpines narrowly missed points in a chaotic race.",
            pitStop: "24.1s"
        },
        {
            round: 17,
            raceName: "Azerbaijan Grand Prix",
            circuit: "Baku City Circuit",
            date: "21 Sep 2025",
            hasTelemetry: false,
            sessions: {
                fp1: { pos: 14, time: "1:43.800" },
                fp2: { pos: 13, time: "1:43.400" },
                fp3: { pos: 14, time: "1:43.100" },
                qualy: { pos: 14, time: "1:42.700", session: "Q2" },
                race: { pos: 15, time: "1:45.900", status: "Finished", points: 0 }
            },
            gasly: { qualyPos: 12, racePos: 13 },
            doohan: { qualyPos: 16, racePos: 16 },
            highlights: "Challenging Baku weekend. Struggled with car balance on the street circuit. Finished P15 after a difficult race. Looking to regroup for Singapore.",
            pitStop: "25.2s"
        },
        {
            round: 18,
            raceName: "Singapore Grand Prix",
            circuit: "Marina Bay Street Circuit",
            date: "05 Oct 2025",
            hasTelemetry: false,
            sessions: {
                fp1: { pos: 13, time: "1:31.900" },
                fp2: { pos: 12, time: "1:31.500" },
                fp3: { pos: 13, time: "1:31.200" },
                qualy: { pos: 13, time: "1:30.800", session: "Q2" },
                race: { pos: 14, time: "1:34.100", status: "Finished", points: 0 }
            },
            gasly: { qualyPos: 11, racePos: 12 },
            doohan: { qualyPos: 15, racePos: 15 },
            highlights: "Hot and humid Singapore night race. Managed tire temperatures well but lacked ultimate pace. Finished P14 in the grueling 2-hour race. Physical endurance test passed.",
            pitStop: "24.6s"
        },
        {
            round: 19,
            raceName: "United States Grand Prix",
            circuit: "Circuit of the Americas",
            date: "19 Oct 2025",
            hasSprint: true,
            hasTelemetry: false,
            sessions: {
                fp1: { pos: 12, time: "1:35.100" },
                sprintQualy: { pos: 13, time: "1:34.700", session: "SQ2" },
                sprint: { pos: 12, status: "Finished" },
                qualy: { pos: 12, time: "1:34.300", session: "Q2" },
                race: { pos: 13, time: "1:37.600", status: "Finished", points: 0 }
            },
            gasly: { qualyPos: 10, racePos: 11 },
            doohan: { qualyPos: 14, racePos: 14 },
            highlights: "COTA sprint weekend. Consistent performances across all sessions. Finished P13 in the main race. Alpine showing better race pace but still lacking qualifying speed.",
            pitStop: "23.8s"
        },
        {
            round: 20,
            raceName: "Mexico City Grand Prix",
            circuit: "Autódromo Hermanos Rodríguez",
            date: "26 Oct 2025",
            hasTelemetry: false,
            sessions: {
                fp1: { pos: 13, time: "1:18.400" },
                fp2: { pos: 14, time: "1:18.000" },
                fp3: { pos: 13, time: "1:17.700" },
                qualy: { pos: 13, time: "1:17.300", session: "Q2" },
                race: { pos: 12, time: "1:20.600", status: "Finished", points: 0 }
            },
            gasly: { qualyPos: 11, racePos: 10 },
            doohan: { qualyPos: 15, racePos: 13 },
            highlights: "High-altitude challenge in Mexico City. Finished P12, narrowly missing points again. Gasly secured P10. Alpine's thin air setup working reasonably well.",
            pitStop: "24.4s"
        },
        {
            round: 21,
            raceName: "São Paulo Grand Prix",
            circuit: "Autódromo José Carlos Pace",
            date: "09 Nov 2025",
            hasSprint: true,
            hasTelemetry: false,
            sessions: {
                fp1: { pos: 12, time: "1:10.800" },
                sprintQualy: { pos: 13, time: "1:10.400", session: "SQ2" },
                sprint: { pos: 14, status: "Finished" },
                qualy: { pos: 12, time: "1:10.100", session: "Q2" },
                race: { pos: 13, time: "1:13.400", status: "Finished", points: 0 }
            },
            gasly: { qualyPos: 10, racePos: 12 },
            doohan: { qualyPos: 14, racePos: 15 },
            highlights: "Interlagos sprint weekend. Solid performances but no points. Finished P13 in the main race. Alpine's pace competitive but not quite enough for top 10.",
            pitStop: "23.9s"
        },
        {
            round: 22,
            raceName: "Las Vegas Grand Prix",
            circuit: "Las Vegas Street Circuit",
            date: "22 Nov 2025",
            hasTelemetry: false,
            sessions: {
                fp1: { pos: 13, time: "1:34.200" },
                fp2: { pos: 12, time: "1:33.800" },
                fp3: { pos: 13, time: "1:33.500" },
                qualy: { pos: 13, time: "1:33.100", session: "Q2" },
                race: { pos: 14, time: "1:36.400", status: "Finished", points: 0 }
            },
            gasly: { qualyPos: 11, racePos: 13 },
            doohan: { qualyPos: 15, racePos: 16 },
            highlights: "Vegas night race under the lights. Cold track temperatures challenging. Finished P14 in the high-speed street circuit. Consistent but unrewarded season continues.",
            pitStop: "24.7s"
        },
        {
            round: 23,
            raceName: "Qatar Grand Prix",
            circuit: "Lusail International Circuit",
            date: "30 Nov 2025",
            hasSprint: true,
            hasTelemetry: false,
            sessions: {
                fp1: { pos: 12, time: "1:22.500" },
                sprintQualy: { pos: 13, time: "1:22.100", session: "SQ2" },
                sprint: { pos: 13, status: "Finished" },
                qualy: { pos: 12, time: "1:21.800", session: "Q2" },
                race: { pos: 12, time: "1:25.100", status: "Finished", points: 0 }
            },
            gasly: { qualyPos: 10, racePos: 11 },
            doohan: { qualyPos: 14, racePos: 14 },
            highlights: "Penultimate race in Qatar. Finished P12, matching the season's best. Consistent pace throughout the weekend. One race left to try for that elusive first point.",
            pitStop: "23.6s"
        },
        {
            round: 24,
            raceName: "Abu Dhabi Grand Prix",
            circuit: "Yas Marina Circuit",
            date: "07 Dec 2025",
            hasTelemetry: false,
            sessions: {
                fp1: { pos: 13, time: "1:24.700" },
                fp2: { pos: 12, time: "1:24.300" },
                fp3: { pos: 13, time: "1:24.000" },
                qualy: { pos: 13, time: "1:23.600", session: "Q2" },
                race: { pos: 13, time: "1:27.200", status: "Finished", points: 0 }
            },
            gasly: { qualyPos: 11, racePos: 12 },
            doohan: { qualyPos: 15, racePos: 15 },
            highlights: "Season finale under the lights. Finished P13, ending the season without points but with valuable experience. Showed consistent improvement and racecraft throughout the 17 races with Alpine.",
            pitStop: "24.2s"
        }
    ];

    // State
    let currentSeasonYear = 2024;
    let currentData = season2024;

    // Theme Colors
    const themes = {
        2024: { primary: '#005aff', bg: 'rgba(0, 90, 255, 0.1)', team: 'Williams Racing', logo: 'Williams' },
        2025: { primary: '#FD4BC7', bg: 'rgba(253, 75, 199, 0.1)', team: 'BWT Alpine F1 Team', logo: 'Alpine' }
    };

    // --- Navigation Logic ---
    window.showSeasonView = () => renderSeasonView(currentData);
    window.showRaceDetail = (round) => {
        const race = currentData.find(r => r.round === round);
        if (race) renderRaceDetail(race);
    };

    window.toggleSeason = (year) => {
        currentSeasonYear = year;
        currentData = year === 2024 ? season2024 : season2025;
        renderSeasonView(currentData);
    };

    // Initial Render
    renderSeasonView(currentData);

    // --- Views ---

    function renderSeasonView(data) {
        const theme = themes[currentSeasonYear];
        const teammateName = currentSeasonYear === 2024 ? 'Albon' : 'Gasly';

        // Calculate Stats
        const totalPoints = data.reduce((acc, curr) => acc + (curr.sessions.race.points || 0), 0);
        const finishedRaces = data.filter(r => r.sessions.race.status === "Finished");
        const bestFinish = finishedRaces.length > 0 ? Math.min(...finishedRaces.map(r => r.sessions.race.pos)) : '-';
        const avgPos = finishedRaces.length > 0 ? (finishedRaces.reduce((acc, curr) => acc + curr.sessions.race.pos, 0) / finishedRaces.length).toFixed(1) : '-';

        // Prepare Chart Data
        const labels = data.map(r => r.circuit);
        const qualyPositions = data.map(r => r.sessions.qualy.pos);
        const teammateQualy = data.map(r => r[teammateName.toLowerCase()].qualyPos || null);

        appContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2 style="margin: 0;">Season Analysis</h2>
                <div style="display: flex; gap: 1rem; background: #222; padding: 0.5rem; border-radius: 8px;">
                    <button onclick="window.toggleSeason(2024)" style="background: ${currentSeasonYear === 2024 ? '#005aff' : 'transparent'}; color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: bold;">2024 (Williams)</button>
                    <button onclick="window.toggleSeason(2025)" style="background: ${currentSeasonYear === 2025 ? '#FD4BC7' : 'transparent'}; color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: bold;">2025 (Alpine)</button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card" style="border-left: 4px solid ${theme.primary};">
                    <h3>Franco Colapinto</h3>
                    <div class="big-number">#43</div>
                    <p>${theme.team}</p>
                </div>
                <div class="stat-card">
                    <h3>Total Points</h3>
                    <div class="big-number">${totalPoints}</div>
                    <p>${currentSeasonYear} Season (${data.length} Races)</p>
                </div>
                <div class="stat-card">
                    <h3>Best Finish</h3>
                    <div class="big-number">P${bestFinish}</div>
                    <p>Best Result</p>
                </div>
                <div class="stat-card">
                    <h3>Avg. Finish</h3>
                    <div class="big-number">P${avgPos}</div>
                    <p>In Finished Races</p>
                </div>
            </div>

            <div class="charts-row" style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-top: 1.5rem;">
                <div class="card-panel">
                    <h3>Qualifying Battle vs ${teammateName}</h3>
                    <canvas id="colapintoChart"></canvas>
                </div>
                ${currentSeasonYear === 2025 ? `
                <div class="card-panel">
                    <h3>Race Pace Gap vs ${teammateName} (sec/lap)</h3>
                    <canvas id="racePaceChart"></canvas>
                </div>
                ` : ''}
            </div>

            <h3 style="margin-top: 2rem; margin-bottom: 1rem;">${currentSeasonYear} Race Calendar</h3>
            <div class="race-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem;">
                ${data.map(r => {
            const raceClass = r.sessions.race.status === 'DNF' ? 'status-dnf' : (r.sessions.race.points > 0 ? 'status-points' : '');
            const raceResult = r.sessions.race.status === 'DNF' ? 'DNF' : `P${r.sessions.race.pos}`;

            return `
                        <div class="card-panel race-card" onclick="window.showRaceDetail(${r.round})" style="cursor: pointer; transition: transform 0.2s; border: 1px solid transparent; border-left: 3px solid ${theme.primary};">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <span style="font-size: 0.8em; color: #888;">Round ${r.round}</span>
                                <span style="font-size: 0.8em; color: #888;">${r.date}</span>
                            </div>
                            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.2rem;">${r.raceName}</h3>
                            <p style="margin: 0; color: #ccc;">${r.circuit}</p>
                            <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="font-size: 0.8em; color: #888;">Qualy</div>
                                    <div style="font-weight: bold;">P${r.sessions.qualy.pos}</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 0.8em; color: #888;">Race</div>
                                    <div class="${raceClass}" style="font-weight: bold;">${raceResult}</div>
                                </div>
                            </div>
                            ${r.hasTelemetry ? `<div style="margin-top: 0.5rem; font-size: 0.7em; color: ${theme.primary}; text-align: right;">Telemetry Available <i class="fas fa-chart-line"></i></div>` : ''}
                        </div>
                    `;
        }).join('')}
            </div>
            
            <style>
                .race-card:hover {
                    transform: translateY(-5px);
                    border-color: ${theme.primary} !important;
                }
            </style>
        `;

        // Render Qualy Chart
        const ctx = document.getElementById('colapintoChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Colapinto Qualy',
                        data: qualyPositions,
                        borderColor: theme.primary,
                        backgroundColor: theme.bg,
                        tension: 0.3,
                        pointRadius: 4
                    },
                    {
                        label: `${teammateName} Qualy`,
                        data: teammateQualy,
                        borderColor: '#ffffff',
                        borderDash: [5, 5],
                        tension: 0.3,
                        pointRadius: 3,
                        pointBackgroundColor: '#333'
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: 'white' } },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: {
                        reverse: true,
                        min: 1,
                        max: 20,
                        title: { display: true, text: 'Position', color: '#a0a0a0' },
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: '#a0a0a0', stepSize: 1 }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#a0a0a0' }
                    }
                }
            }
        });

        // Render Race Pace Chart (Only 2025)
        if (currentSeasonYear === 2025) {
            const ctxPace = document.getElementById('racePaceChart').getContext('2d');
            // Simulated Race Pace Gaps (Negative = Faster than Gasly)
            const paceGaps = [0.05, -0.1, -0.2, 0.0, -0.15];

            new Chart(ctxPace, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Gap to Gasly (s)',
                        data: paceGaps,
                        backgroundColor: paceGaps.map(g => g < 0 ? theme.primary : '#ff3333'), // Pink if faster, Red if slower
                        borderColor: '#fff',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const val = context.raw;
                                    return val < 0 ? `Faster by ${Math.abs(val)}s` : `Slower by ${val}s`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            title: { display: true, text: 'Gap (seconds)', color: '#a0a0a0' },
                            grid: { color: 'rgba(255,255,255,0.1)' },
                            ticks: { color: '#a0a0a0' }
                        },
                        x: {
                            ticks: { color: '#a0a0a0' }
                        }
                    }
                }
            });
        }
    }

    function renderRaceDetail(race) {
        const theme = themes[currentSeasonYear];
        const teammateName = currentSeasonYear === 2024 ? 'Albon' : 'Gasly';
        const teammateKey = teammateName.toLowerCase();
        const teammateData = race[teammateKey];

        appContainer.innerHTML = `
            <button onclick="window.showSeasonView()" style="background: none; border: none; color: #aaa; cursor: pointer; font-size: 1rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                &larr; Back to Season
            </button>
            
            <div class="card-panel" style="margin-bottom: 1.5rem; border-left: 4px solid ${theme.primary};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <h1 style="margin: 0; font-size: 2rem;">${race.raceName}</h1>
                        <p style="margin: 0.5rem 0 0 0; color: #888; font-size: 1.1rem;">${race.circuit} &bull; Round ${race.round}</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 2rem; font-weight: bold; color: ${race.sessions.race.points > 0 ? '#00ff7f' : '#fff'}">
                            ${race.sessions.race.status === 'DNF' ? 'DNF' : 'P' + race.sessions.race.pos}
                        </div>
                        <div style="color: #888;">Race Result</div>
                    </div>
                </div>
                
                <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #333;">
                    <h3 style="margin-top: 0;">Highlights</h3>
                    <p style="line-height: 1.6; color: #ddd;">${race.highlights}</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
                <div class="card-panel">
                    <h3>Session Results</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
                        ${Object.entries(race.sessions).map(([key, session]) => {
            if (key === 'race') return ''; // Skip race, shown in header
            const label = key.toUpperCase();
            return `
                                <tr style="border-bottom: 1px solid #333;">
                                    <td style="padding: 0.8rem 0; color: #888;">${label}</td>
                                    <td style="padding: 0.8rem 0; text-align: right; font-weight: bold;">P${session.pos}</td>
                                    <td style="padding: 0.8rem 0; text-align: right; font-family: monospace;">${session.time || '-'}</td>
                                </tr>
                            `;
        }).join('')}
                        <tr style="border-bottom: 1px solid #333;">
                            <td style="padding: 0.8rem 0; color: #888;">RACE</td>
                            <td style="padding: 0.8rem 0; text-align: right; font-weight: bold;">${race.sessions.race.status === 'DNF' ? 'DNF' : 'P' + race.sessions.race.pos}</td>
                            <td style="padding: 0.8rem 0; text-align: right; font-family: monospace;">${race.sessions.race.time || '-'}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="card-panel">
                    <h3>Comparison vs ${teammateName}</h3>
                    <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1rem;">
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Qualifying</span>
                                <span style="font-weight: bold;">${race.sessions.qualy.pos < teammateData.qualyPos ? 'AHEAD' : 'BEHIND'}</span>
                            </div>
                            <div style="height: 8px; background: #333; border-radius: 4px; overflow: hidden; display: flex;">
                                <div style="width: 50%; background: ${theme.primary}; border-right: 2px solid #1a1a1a;"></div>
                                <div style="width: 50%; background: #666;"></div>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.8em; margin-top: 0.3rem; color: #888;">
                                <span>Colapinto: P${race.sessions.qualy.pos}</span>
                                <span>${teammateName}: P${teammateData.qualyPos}</span>
                            </div>
                        </div>
                        
                        ${teammateData.racePos ? `
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Race</span>
                                <span style="font-weight: bold;">${(race.sessions.race.pos && race.sessions.race.pos < teammateData.racePos) ? 'AHEAD' : 'BEHIND'}</span>
                            </div>
                            <div style="height: 8px; background: #333; border-radius: 4px; overflow: hidden; display: flex;">
                                <div style="width: 50%; background: ${theme.primary}; border-right: 2px solid #1a1a1a;"></div>
                                <div style="width: 50%; background: #666;"></div>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.8em; margin-top: 0.3rem; color: #888;">
                                <span>Colapinto: ${race.sessions.race.status === 'DNF' ? 'DNF' : 'P' + race.sessions.race.pos}</span>
                                <span>${teammateName}: P${teammateData.racePos}</span>
                            </div>
                        </div>
                        ` : `<p style="color:#666; font-style:italic;">${teammateName} DNF/DNS in Race</p>`}
                    </div>
                </div>
            </div>

            ${race.hasTelemetry ? `
                <div id="telemetry-container">
                    <h2 style="margin-bottom: 1.5rem;">Telemetry Analysis (Fastest Lap)</h2>
                    
                    <!-- Top Row: Speed (Left) + Map (Right) -->
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                        <div class="card-panel">
                            <h3>Speed Trace</h3>
                            <canvas id="speedChart"></canvas>
                        </div>
                        <div class="card-panel">
                            <h3>Circuit Map</h3>
                            <div style="color: #888; font-size: 0.9em; margin-bottom: 1rem; margin-top: -0.5rem;">
                                ${(() => {
                    const flags = {
                        "Monza": "🇮🇹",
                        "Baku": "🇦🇿",
                        "Singapore": "🇸🇬",
                        "Austin": "🇺🇸",
                        "Mexico City": "🇲🇽",
                        "São Paulo": "🇧🇷",
                        "Las Vegas": "🇺🇸",
                        "Qatar": "🇶🇦",
                        "Abu Dhabi": "🇦🇪"
                    };
                    // Extract key from raceName or circuit to match keys
                    let key = "";
                    if (race.raceName.includes("Italian")) key = "Monza";
                    else if (race.raceName.includes("Azerbaijan")) key = "Baku";
                    else if (race.raceName.includes("Singapore")) key = "Singapore";
                    else if (race.raceName.includes("United States")) key = "Austin";
                    else if (race.raceName.includes("Mexico")) key = "Mexico City";
                    else if (race.raceName.includes("São Paulo")) key = "São Paulo";
                    else if (race.raceName.includes("Las Vegas")) key = "Las Vegas";
                    else if (race.raceName.includes("Qatar")) key = "Qatar";
                    else if (race.raceName.includes("Abu Dhabi")) key = "Abu Dhabi";

                    return `${key ? flags[key] : ''} ${race.circuit}`;
                })()}
                            </div>
                            <div style="position: relative; height: 300px; width: 100%;">
                                <canvas id="trackMap"></canvas>
                            </div>
                            <!-- Sector Times -->
                            <div id="sector-times" style="margin-top: 1rem; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; font-family: monospace; font-size: 0.9em;">
                                <div style="background: rgba(0, 90, 255, 0.1); padding: 0.5rem; border-radius: 4px; border-left: 3px solid #005aff;">
                                    <div style="color:#fff; font-weight:bold; font-size:0.8em;">Sector 1</div>
                                    <div id="s1-time" style="color:#fff; font-weight:bold; font-size:1.1em;">-</div>
                                </div>
                                <div style="background: rgba(0, 90, 255, 0.1); padding: 0.5rem; border-radius: 4px; border-left: 3px solid #005aff;">
                                    <div style="color:#fff; font-weight:bold; font-size:0.8em;">Sector 2</div>
                                    <div id="s2-time" style="color:#fff; font-weight:bold; font-size:1.1em;">-</div>
                                </div>
                                <div style="background: rgba(0, 90, 255, 0.1); padding: 0.5rem; border-radius: 4px; border-left: 3px solid #005aff;">
                                    <div style="color:#fff; font-weight:bold; font-size:0.8em;">Sector 3</div>
                                    <div id="s3-time" style="color:#fff; font-weight:bold; font-size:1.1em;">-</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Row: Pedals + Gear/RPM -->
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem;">
                        <div class="card-panel">
                            <h3>Throttle & Brake</h3>
                            <canvas id="pedalsChart"></canvas>
                        </div>
                        <div class="card-panel" style="display:grid; grid-template-rows: 1fr 1fr; gap:1rem;">
                            <div style="position: relative;">
                                <h4 style="margin:0 0 0.5rem 0; font-size:0.9em; color:#888;">Gear</h4>
                                <canvas id="gearChart" style="max-height: 150px;"></canvas>
                            </div>
                            <div style="position: relative;">
                                <h4 style="margin:0 0 0.5rem 0; font-size:0.9em; color:#888;">RPM</h4>
                                <canvas id="rpmChart" style="max-height: 150px;"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;

        if (race.hasTelemetry) {
            loadTelemetryCharts(race.telemetryId, race.raceName);
        }
    }

    async function loadTelemetryCharts(telemetryId, raceName) {
        try {
            // Fetch from public/telemetry (served at root)
            // Files were moved to public/telemetry
            const response = await fetch(`/telemetry/${telemetryId}.json`);
            const data = await response.json();

            const telemetry = data.telemetry;
            const distance = telemetry.Distance;
            const xCoords = telemetry.X;
            const yCoords = telemetry.Y;

            // Update Sector Times
            if (data.sector1) {
                const formatSector = (timeStr) => {
                    if (!timeStr) return '-';
                    const match = timeStr.match(/(\d{2}:\d{2}\.\d+)/);
                    if (match) {
                        let cleanTime = match[1].replace(/^00:/, '');
                        if (cleanTime.startsWith('0')) cleanTime = cleanTime.substring(1); // Remove leading zero if < 10s (e.g. 09.123 -> 9.123)

                        // Truncate to 3 decimal places
                        if (cleanTime.includes('.')) {
                            const parts = cleanTime.split('.');
                            if (parts[1].length > 3) {
                                parts[1] = parts[1].substring(0, 3);
                            }
                            return parts.join('.');
                        }
                        return cleanTime;
                    }
                    return timeStr;
                };


                document.getElementById('s1-time').innerText = formatSector(data.sector1);
                document.getElementById('s2-time').innerText = formatSector(data.sector2);
                document.getElementById('s3-time').innerText = formatSector(data.sector3);

                // Calculate Sector Split Distances
                const parseTime = (timeStr) => {
                    // unexpected format safety check
                    if (!timeStr || typeof timeStr !== 'string') return 0;
                    // Extract "HH:MM:SS.micros" part
                    const parts = timeStr.split(' ');
                    const timePart = parts[parts.length - 1]; // "00:00:26.613000"
                    const [h, m, s] = timePart.split(':');
                    return (parseInt(h) * 3600) + (parseInt(m) * 60) + parseFloat(s);
                };

                const s1Time = parseTime(data.sector1);
                const s2Time = s1Time + parseTime(data.sector2);

                // Find distances for these times
                const findDistAtTime = (targetTime) => {
                    // Simple linear search or finding closest
                    let closestIdx = 0;
                    let minDiff = Infinity;
                    for (let i = 0; i < time.length; i++) {
                        const diff = Math.abs(time[i] - targetTime);
                        if (diff < minDiff) {
                            minDiff = diff;
                            closestIdx = i;
                        }
                    }
                    return distance[closestIdx];
                };

                const s1Dist = findDistAtTime(s1Time);
                const s2Dist = findDistAtTime(s2Time);

                // Custom Plugin for Sector Lines
                const sectorLinePlugin = {
                    id: 'sectorLines',
                    afterDatasetsDraw(chart) {
                        const { ctx, chartArea: { top, bottom }, scales: { x } } = chart;

                        const drawLine = (value, label) => {
                            const xPos = x.getPixelForValue(value);
                            if (xPos >= x.left && xPos <= x.right) {
                                ctx.save();
                                ctx.beginPath();
                                ctx.lineWidth = 2;
                                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; // Distinct vertical line
                                ctx.setLineDash([5, 5]);
                                ctx.moveTo(xPos, top);
                                ctx.lineTo(xPos, bottom);
                                ctx.stroke();

                                // Label
                                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                                ctx.textAlign = 'left';
                                ctx.fillText(label, xPos + 5, top + 10);
                                ctx.restore();
                            }
                        };

                        if (s1Dist) drawLine(s1Dist, 'S1');
                        if (s2Dist) drawLine(s2Dist, 'S2');
                    }
                };


                // Helper to create chart
                const createChart = (id, label, dataPoints, color, type = 'line', yAxisLabel = '') => {
                    const ctx = document.getElementById(id).getContext('2d');
                    return new Chart(ctx, {
                        type: type,
                        data: {
                            labels: distance,
                            datasets: [{
                                label: label,
                                data: dataPoints,
                                borderColor: color,
                                backgroundColor: color.replace('1)', '0.1)').replace('rgb', 'rgba'),
                                borderWidth: 1.5,
                                pointRadius: 0,
                                fill: type === 'line'
                            }]
                        },
                        plugins: [sectorLinePlugin], // Add the plugin here
                        options: {
                            responsive: true,
                            animation: { duration: 500 },
                            interaction: { mode: 'index', intersect: false },
                            plugins: {
                                legend: { display: true, labels: { color: '#fff' } },
                                tooltip: {
                                    callbacks: {
                                        title: (context) => {
                                            return `Distance: ${context[0].label}m`; // Clarify the top number
                                        }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    type: 'linear',
                                    display: true,
                                    title: { display: true, text: 'Distance (m)', color: '#999', font: { size: 12 } },
                                    ticks: { color: '#666' }
                                },
                                y: { display: true, title: { display: !!yAxisLabel, text: yAxisLabel, color: '#999' }, ticks: { color: '#666' } }
                            }
                        }
                    });
                };

                // Track Map (Scatter Plot)
                if (xCoords && yCoords) {
                    const ctxMap = document.getElementById('trackMap').getContext('2d');
                    const trackData = xCoords.map((x, i) => ({ x: x, y: yCoords[i] }));

                    new Chart(ctxMap, {
                        type: 'scatter',
                        data: {
                            datasets: [{
                                label: 'Track Layout',
                                data: trackData,
                                borderColor: '#005aff',
                                backgroundColor: '#005aff',
                                pointRadius: 2,
                                showLine: true,
                                borderWidth: 2
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false }, tooltip: { enabled: false } },
                            scales: {
                                x: { display: false },
                                y: { display: false }
                            },
                            elements: {
                                point: { radius: 0 }
                            }
                        }
                    });
                }

                // Speed Chart
                createChart('speedChart', 'Speed (km/h)', telemetry.Speed, 'rgb(0, 255, 127)', 'line', 'Speed');

                // Throttle & Brake (Mixed)
                const ctxPedals = document.getElementById('pedalsChart').getContext('2d');
                new Chart(ctxPedals, {
                    type: 'line',
                    data: {
                        labels: distance,
                        datasets: [
                            {
                                label: 'Throttle (%)',
                                data: telemetry.Throttle,
                                borderColor: 'rgb(0, 255, 127)',
                                borderWidth: 1,
                                pointRadius: 0,
                                yAxisID: 'y'
                            },
                            {
                                label: 'Brake (On/Off)',
                                data: telemetry.Brake.map(b => b ? 100 : 0),
                                borderColor: 'rgb(255, 50, 50)',
                                backgroundColor: 'rgba(255, 50, 50, 0.2)',
                                borderWidth: 1,
                                pointRadius: 0,
                                fill: true,
                                yAxisID: 'y'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        animation: { duration: 500 },
                        interaction: { mode: 'index', intersect: false },
                        plugins: { legend: { labels: { color: '#fff' } } },
                        scales: {
                            x: { type: 'linear', display: true, ticks: { color: '#666' } },
                            y: { min: 0, max: 105, ticks: { color: '#666' } }
                        }
                    }
                });

                // Gear Chart
                createChart('gearChart', 'Gear', telemetry.nGear, 'rgb(255, 200, 0)', 'line');

                // RPM Chart
                createChart('rpmChart', 'RPM', telemetry.RPM, 'rgb(0, 150, 255)', 'line');

            } catch (error) {
                console.error("Error loading telemetry:", error);
                document.getElementById('telemetry-container').innerHTML += `<p style="color:red">Error loading telemetry data.</p>`;
            }
        }
}
