import { getUserInfos } from "./fetchUser.js";
import { getCurrentFriendInfo } from "../spa/friends.js";
import { getCSRFToken } from "./csrf.js";

export async function set1v1victory(player1, player2, scores, is_ai, is_tournament) {
    const userData = await getUserInfos();
    if (userData.match_history === false) {
        console.log("User does not want to keep match history")
        return;
    }
    const formData = new FormData();
    formData.append('user_origin', userData.username);
    formData.append('player1_username', player1.name);
    formData.append('player2_username', player2.name);
    scores.p1 < scores.p2 ? formData.append('result', player2.name) : formData.append('result', player1.name);
    formData.append('player1_score', scores.p1);
    formData.append('player2_score', scores.p2);
    formData.append('is_ai', is_ai);
    formData.append('is_tournament', is_tournament);

    try {
        const csrfToken = getCSRFToken('csrftoken');
        if (!csrfToken) {
            console.error('CSRF token is missing!');
        }
        const response = await fetch('/api/scores/add_game/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
        } else {
            const error = await response.json();
            throw new Error('Failed to add new game:', error);
        }
    }
    catch (error) {
        console.error('Error:', error);
        alert('An error occurred: ' + error.message);
    }
}

export async function setMonopolyVictory(winner) {
    const userData = await getUserInfos();
    if (userData.match_history === false) {
        console.log("User does not want to keep match history")
        return;
    }
    console.log('ICI', winner);
    const formData = new FormData();
    formData.append('user_origin', userData.username);
    formData.append('winner_username', winner.name);
    formData.append('winner_money', winner.money);
    formData.append('winner_properties', winner.propertyOwned.length);
    try {
        const csrfToken = getCSRFToken('csrftoken');
        if (!csrfToken) {
            console.error('CSRF token is missing!');
        }
        const response = await fetch('/api/scores/add_monopoly/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            console.log('New Game added to scores', result);
        } else {
            const error = await response.json();
            console.error('Failed to add new game:', error);
        }
    }
    catch (error) {
        console.error('Error:', error);
        alert('An error occurred: ' + error.message);
    }
}

export async function fetchMatchHistory() {
    try {

        const userData = await getUserInfos();

        const response = await fetch(`/api/scores/match_history/?username=${encodeURIComponent(userData.username)}`, {
            method: 'GET',
            credentials: 'include',
        });

        let data = await response.json();
        if (Array.isArray(data)) {
            data = data.reverse();
        }

        const MatchHistoryList = document.getElementById('match-history-list');
        MatchHistoryList.innerHTML = '';

        let currentPage = 1;
        const itemsPerPage = 3;
        const totalPages = Math.ceil(data.length / itemsPerPage);

        const nb = document.getElementById('nb');
        nb.innerHTML = `Match History (${data.length} games)`;
        const paginationContainer = document.createElement('div');
        paginationContainer.classList.add('pagination-container');
        MatchHistoryList.appendChild(paginationContainer);


        function renderPage(page) {
            MatchHistoryList.innerHTML = '';
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const pageItems = data.slice(start, end);

            pageItems.forEach(match => {
                const matchItem = document.createElement('a');
                matchItem.classList.add('list-group-item');
                if (match.is_pong === true) {
                    matchItem.innerHTML = `
                <h5 class="mb-1">Pong Game: ${match.player1_username} vs ${match.player2_username}</h5>
                <p class="mb-1">Winner: <strong>${match.result}</strong></p>
                <small>Score: ${match.player1_score} - ${match.player2_score}</small>
                <small>AI: ${match.is_ai} Tournament: ${match.is_tournament}</small>
                <br>
                `;
                } else {
                    matchItem.innerHTML = `
                <h5 class="mb-1">Monopoly Game</h5>
                <p class="mb-1">Winner: ${match.player1_username}</p>
                <small>$: ${match.player1_score} - Estate: ${match.player2_score}</small>
                <br>
                `;
                }
                MatchHistoryList.appendChild(matchItem);
            });

            const gap = document.createElement('div');
            gap.style.marginBottom = '10px';
            MatchHistoryList.appendChild(gap);

            const pagination = document.createElement('div');
            pagination.classList.add('pagination');
            pagination.style.display = 'flex';
            pagination.style.justifyContent = 'center';

            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.classList.add('btn', 'btn-outline-light', 'mr-2');
            prevButton.disabled = currentPage === 1;
            prevButton.onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderPage(currentPage);
                }
            };

            const gap2 = document.createElement('span');
            gap2.style.marginRight = '10px';

            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.classList.add('btn', 'btn-outline-light');
            nextButton.disabled = currentPage === totalPages;
            nextButton.onclick = () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderPage(currentPage);
                }
            };

            pagination.appendChild(prevButton);
            pagination.appendChild(gap2);
            pagination.appendChild(nextButton);
            MatchHistoryList.appendChild(pagination);
        }

        renderPage(currentPage);

    } catch (error) {
        console.error('Error fetching match history:', error);
    }
}

export async function fetchStatistics() {
    try {
        const userData = await getUserInfos();

        const response = await fetch(`/api/scores/statistics/?username=${encodeURIComponent(userData.username)}`, {
            method: 'GET',
            credentials: 'include',
        });

        const monop_response = await fetch(`/api/scores/monopoly_stat/?username=${encodeURIComponent(userData.username)}`, {
            method: 'GET',
            credentials: 'include',
        })

        const data = await response.json();
        const monop_data = await monop_response.json();

        const total_f = document.getElementById('total');
        const wins_f = document.getElementById('wins');
        const losses_f = document.getElementById('losses');
        const rate_f = document.getElementById('rate');

        wins_f.innerHTML = losses_f.innerHTML = rate_f.innerHTML = total_f.innerHTML = '';

        total_f.innerHTML = 'TOT: ' + data.total_matches;
        wins_f.innerHTML = 'WINS: ' + data.wins;
        losses_f.innerHTML = 'LOSSES: ' + data.losses;
        rate_f.innerHTML = data.rate + ' % of wins';

        // edit monopoly stats
        document.getElementById('monopoly_total').innerHTML = 'TOT: ' + monop_data.total_monopoly_games;
        let money;
        let estate;
        if (monop_data.average_properties) { estate = Math.round(monop_data.average_properties); } else { estate = 0; }
        if (monop_data.average_money) { money = Math.round(monop_data.average_money); } else { money = 0; }
        document.getElementById('monopoly_avg_money').innerHTML = 'MONEY: $' + money + ' avg';
        document.getElementById('monopoly_avg_properties').innerHTML = 'REAL ESTATE: ' + estate + ' avg';

    } catch (error) {
        console.error('Error fetching statistics:', error);
    }
}

export async function fetchFriendHistory(username) {
    try {

        // const userData = await getCurrentFriendInfo(username);

        // console.log(userData);

        const response = await fetch(`/api/scores/match_history/?username=${encodeURIComponent(username)}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();
        let MatchHistoryList = '<strong>3 last games played:</strong><br>';

        data.reverse().slice(0, 3).forEach(match => {
            if (match.is_pong === true) {
                MatchHistoryList += `
                Pong: ${match.player1_username} (${match.player1_score}) vs ${match.player2_username} (${match.player2_score})`;
                match.is_ai === true ? MatchHistoryList += ` (AI game)<br>` : MatchHistoryList += '<br>';
            }
            else {
                MatchHistoryList += `
                Monop.: ${match.player1_username} $${match.player1_score} ${match.player2_score} properties<br>`;
            }
        });
        console.log(MatchHistoryList);
        return MatchHistoryList;

    } catch (error) {
        console.error('Error fetching match history:', error);
    }
}

export async function fetchFriendStatistics(username) {
    try {

        const response = await fetch(`/api/scores/statistics/?username=${encodeURIComponent(username)}`, {
            method: 'GET',
            credentials: 'include',
        });

        const monop_response = await fetch(`/api/scores/monopoly_stat/?username=${encodeURIComponent(username)}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();
        const monop_data = await monop_response.json();

        let money;
        let estate;
        if (monop_data.average_properties) { estate = Math.round(monop_data.average_properties); } else { estate = 0; }
        if (monop_data.average_money) { money = Math.round(monop_data.average_money); } else { money = 0; }

        let StatList = `<strong>${username} stats vs AI:</strong><br>
            ${data.total_matches} games played, ${data.rate} % of wins
            <br><strong>${username} monopoly stats:</strong><br>
            ${monop_data.total_monopoly_games} games played, $${money} avg,<br>
            ${estate} estate avg
        `;
        return StatList;

    } catch (error) {
        console.error('Error fetching statistics:', error);
    }
}
