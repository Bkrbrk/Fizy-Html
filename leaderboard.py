from dataclasses import dataclass
from typing import List

@dataclass
class LeaderboardEntry:
    rank: int
    user_id: str
    total_points: int

def generate_leaderboard(users: List, ledger: List) -> List[LeaderboardEntry]:
    """Generate leaderboard sorted by total points."""
    from points_ledger import get_total_points
    user_points = []
    for user in users:
        total = get_total_points(user.user_id, ledger)
        user_points.append({'user_id': user.user_id, 'total_points': total})
    user_points.sort(key=lambda x: (-x['total_points'], x['user_id']))
    return [LeaderboardEntry(i+1, u['user_id'], u['total_points']) for i, u in enumerate(user_points)]
