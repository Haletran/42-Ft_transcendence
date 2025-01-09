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

export async function setMonopolyVictory(winner) {
    const userData = await getUserInfos();
    if (userData.match_history === false) {
        console.log("User does not want to keep match history")
        return;
    }
    const formData = new FormData();
    formData.append('user_origin', userData.username);
    formData.append('winner_username', winner.name);
    formData.append('winner_money', winner.money);
    formData.append('winner_properties', winner.propertyOwned.size());
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

        const data = await response.json();

        const MatchHistoryList = document.getElementById('match-history-list');
        MatchHistoryList.innerHTML = '';

        let currentPage = 1;
        const itemsPerPage = 3;
        const totalPages = Math.ceil(data.length / itemsPerPage);

        function renderPage(page) {
            MatchHistoryList.innerHTML = '';
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const pageItems = data.slice(start, end);

            pageItems.reverse().forEach(match => {
                const matchItem = document.createElement('a');
                matchItem.classList.add('list-group-item');
                if (match.is_pong === true) {
                    matchItem.innerHTML = `
                <h5 class="mb-1">Pong Game: ${match.player1_username} vs ${match.player2_username}</h5>
                <p class="mb-1">Winner: ${match.result}</p>
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

            const pagination = document.createElement('div');
            pagination.classList.add('pagination');

            if (currentPage > 1) {
                const prevButton = document.createElement('button');
                prevButton.textContent = 'Previous';
                prevButton.classList.add('btn', 'btn-primary', 'mr-2');
                prevButton.onclick = () => {
                    currentPage--;
                    renderPage(currentPage);
                };
                pagination.appendChild(prevButton);
            }

            if (currentPage < totalPages) {
                const nextButton = document.createElement('button');
                nextButton.textContent = 'Next';
                nextButton.classList.add('btn', 'btn-primary');
                nextButton.onclick = () => {
                    currentPage++;
                    renderPage(currentPage);
                };
                pagination.appendChild(nextButton);
            }

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

        const data = await response.json();

        const total_f = document.getElementById('total');
        const wins_f = document.getElementById('wins');
        const losses_f = document.getElementById('losses');
        const rate_f = document.getElementById('rate');

        wins_f.innerHTML = losses_f.innerHTML = rate_f.innerHTML = total_f.innerHTML = '';
    
        console.log(data);
        total_f.innerHTML = 'TOT: ' + data.total_matches;
        wins_f.innerHTML = 'WINS: ' + data.wins;
        losses_f.innerHTML = 'LOSSES: ' + data.losses;
        rate_f.innerHTML = data.rate + ' % of wins';

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
        const data = await response.json();

        let StatList = `<strong>${username} stats vs AI:</strong><br>
            ${data.total_matches} games played, ${data.rate} % of wins
        `;

        return StatList;

    } catch (error) {
        console.error('Error fetching statistics:', error);
    }
}
