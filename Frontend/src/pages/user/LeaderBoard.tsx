// import React, { useState } from 'react';
// import { Trophy, Medal, Star, Search } from 'lucide-react';
// import Navbar from '../../components/header/Navbar';
// import useDebouncedValue from '../../hooks/debounceHook';
// import { useLeaderBoardListQuery } from '../../store/slices/userSlice';
// import { IUserDocument } from '../../types/userSide/leaderBoard';


// const LeaderBoard = () => {
//     const [page, setPage] = useState(1);
//     const [limit, setLimit] = useState(4);
//     const [search, setSearch] = useState("");
//     const debouncedSearchTerm = useDebouncedValue(search, 500);

//     const {
//         data: Data
//     } = useLeaderBoardListQuery({
//         page,
//         limit,
//         search: debouncedSearchTerm,
//     });

//     const users = Data?.users || [];
//     const total = Data?.total || users.length;;

//     const handleNextPage = () => {
//         if (page * limit < total) {
//             setPage(page + 1);
//         }
//     };

//     const handlePreviousPage = () => {
//         if (page > 1) {
//             setPage(page - 1);
//         }
//     };

//     const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const value = event.target.value;
//         setPage(1);
//         setSearch(value);
//     };


//     return (
//         <>
//             <Navbar />
//             <div className="max-w-6xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl">
//                 <div className="flex items-center justify-between mb-6">
//                     <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//                         <Trophy className="mr-3 text-yellow-500" size={36} />
//                         Quiz Competition Leaderboard
//                     </h1>
//                     <div className="mb-8">
//                         <div className="relative">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
//                             <input
//                                 type="text"
//                                 placeholder="Search..."
//                                 value={search}
//                                 onChange={handleSearchChange}
//                                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>
//                     </div>
//                     <div className="text-sm text-gray-500">Last Updated: Just Now</div>
//                 </div>

//                 <div className="bg-gray-50 rounded-lg overflow-hidden">
//                     <table className="w-full">
//                         <thead className="bg-gray-100 border-b">
//                             <tr>
//                                 <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
//                                 <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
//                                 <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
//                                 <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {users.map((player: IUserDocument, index: any) => (
//                                 <tr
//                                     key={player.id}
//                                 //                     className={`
//                                 //   ${index === 0 ? 'bg-yellow-50' : 'hover:bg-gray-100'} 
//                                 //   border-b last:border-b-0 transition-colors duration-200
//                                 // `}
//                                 >
//                                     <td className="p-3">
//                                         {player.quizProgress?.rank === "1" ? (
//                                             <Trophy className="text-yellow-500" size={24} />
//                                         ) : player.quizProgress?.rank === "2" ? (
//                                             <Medal className="text-gray-400" size={24} />
//                                         ) : player.quizProgress?.rank === "3" ? (
//                                             <Medal className="text-orange-400" size={24} />
//                                         ) : (
//                                             <span className="font-bold text-gray-600">{player.quizProgress?.rank}</span>
//                                         )}
//                                     </td>
//                                     <td className="p-3">
//                                         <div className="flex items-center">
//                                             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                                                 {player.userName.charAt(0)}
//                                             </div>
//                                             <div>
//                                                 <div className="font-semibold text-gray-800">{player.userName}</div>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className="p-3 text-right">
//                                         <span className="font-bold text-blue-600">{player.quizProgress?.score}</span>
//                                     </td>
//                                     <td className="p-3 text-right">
//                                         <span className={`font-semibold ${(player.quizProgress?.progress ?? '').toString().startsWith('+')
//                                                 ? 'text-green-600'
//                                                 : 'text-red-600'
//                                             }
// `}>
//                                             {player.quizProgress?.progress}
//                                             <Star className="inline ml-1" size={16} />
//                                         </span>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//                 <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
//                     <div className="flex flex-1 justify-between sm:hidden">
//                         <button
//                             onClick={handlePreviousPage}
//                             disabled={page === 1}
//                             className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
//                         >
//                             Previous
//                         </button>
//                         <button
//                             onClick={handleNextPage}
//                             disabled={page * limit >= total}
//                             className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
//                         >
//                             Next
//                         </button>
//                     </div>
//                     <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
//                         <div>
//                             <p className="text-sm text-gray-700">
//                                 Showing{' '}
//                                 <span className="font-medium">{(page - 1) * limit + 1}</span>{' '}
//                                 to{' '}
//                                 <span className="font-medium">{Math.min(page * limit, total)}</span>{' '}
//                                 of{' '}
//                                 <span className="font-medium">{total}</span>{' '}
//                                 results
//                             </p>
//                         </div>
//                         <div>
//                             <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
//                                 <button
//                                     onClick={handlePreviousPage}
//                                     disabled={page === 1}
//                                     className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
//                                 >
//                                     Previous
//                                 </button>
//                                 <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
//                                     {page}
//                                 </button>
//                                 <button
//                                     onClick={handleNextPage}
//                                     disabled={page * limit >= total}
//                                     className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
//                                 >
//                                     Next
//                                 </button>
//                             </nav>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default LeaderBoard;




import React, { useState } from 'react';
import { Trophy, Medal, Star, Search, UserCircle } from 'lucide-react';
import Navbar from '../../components/header/Navbar';
import useDebouncedValue from '../../hooks/debounceHook';
import { useLeaderBoardListQuery } from '../../store/slices/userSlice';
import { IUserDocument } from '../../types/userSide/leaderBoard';
import { useAppSelector } from '../../store/hook';

const LeaderBoard = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(4);
    const [search, setSearch] = useState("");
    const debouncedSearchTerm = useDebouncedValue(search, 500);

    const {
        data: Data
    } = useLeaderBoardListQuery({
        page,
        limit,
        search: debouncedSearchTerm,
    });

    const users = Data?.users || [];
    const total = Data?.total || users.length;
    const currentUser = Data?.currentUser

    const handleNextPage = () => {
        if (page * limit < total) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setPage(1);
        setSearch(value);
    };

    return (
        <>
            <Navbar />
            <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <Trophy className="mr-3 text-yellow-500" size={36} />
                        Quiz Competition Leaderboard
                    </h1>
                    <div className="mb-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {currentUser && (
                    <div className="mt-4 mb-4 p-4 bg-blue-50 rounded-lg">
                        <h2 className="text-xl font-bold mb-2">Your Performance</h2>
                        <div className="flex items-center space-x-4">
                            <div>
                                <span className="font-semibold">Rank:</span> {currentUser.quizProgress?.rank}
                            </div>
                            <div>
                                <span className="font-semibold">Score:</span> {currentUser.quizProgress?.score}
                            </div>
                            <div>
                                <span className="font-semibold">Progress: </span> 
                                <span className={
                                    (currentUser.quizProgress?.progress ?? '').toString().startsWith('+')
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                }>
                                    {currentUser.quizProgress?.progress}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                                <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((player: IUserDocument, index: number) => (
                                <tr
                                    key={player.id}
                                    className={`
                                        ${player._id === currentUser._id
                                            ? 'bg-blue-100 font-bold' 
                                            : 'hover:bg-gray-100'
                                        } 
                                        border-b last:border-b-0 transition-colors duration-200
                                    `}
                                >
                                    <td className="p-3">
                                        {player.quizProgress?.rank === "1" ? (
                                            <Trophy className="text-yellow-500" size={24} />
                                        ) : player.quizProgress?.rank === "2" ? (
                                            <Medal className="text-gray-400" size={24} />
                                        ) : player.quizProgress?.rank === "3" ? (
                                            <Medal className="text-orange-400" size={24} />
                                        ) : (
                                            <span className="font-bold text-gray-600">{player.quizProgress?.rank}</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 
                                                ${player.id === currentUser._id 
                                                    ? 'bg-blue-300' 
                                                    : 'bg-blue-100'
                                                }`
                                            }>
                                                <img 
                                                src={player.profilePhoto}
                                                className='h-10 w-10 rounded-full'
                                                />
                                            </div>
                                            <div>
                                                <div className={`font-semibold ${player.id === currentUser._id ? 'text-blue-800' : 'text-gray-800'}`}>
                                                    {player.userName}
                                                    {player.id === currentUser._id && <span className="ml-2 text-xs text-blue-600">(You)</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 text-right">
                                        <span className={`font-bold ${player.id === currentUser._id  ? 'text-blue-700' : 'text-blue-600'}`}>
                                            {player.quizProgress?.score}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <span className={`font-semibold ${
                                            (player.quizProgress?.progress ?? '').toString().startsWith('+')
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}>
                                            {player.quizProgress?.progress}
                                            <Star className="inline ml-1" size={16} />
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button
                            onClick={handlePreviousPage}
                            disabled={page === 1}
                            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={page * limit >= total}
                            className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing{' '}
                                <span className="font-medium">{(page - 1) * limit + 1}</span>{' '}
                                to{' '}
                                <span className="font-medium">{Math.min(page * limit, total)}</span>{' '}
                                of{' '}
                                <span className="font-medium">{total}</span>{' '}
                                results
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={page === 1}
                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                    {page}
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={page * limit >= total}
                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                     </div>
              </div>
            </div>
        </>
    );
}

export default LeaderBoard;