import React from 'react'
import { Search } from 'lucide-react'

const UserCoursePage = () => {
    return (
        <div className='w-[300px] m-7 bg-gray-50 rounded-[3px]'>
            <h2 className='mt-2 ml-2 font-bold'>Search</h2>
            <div className="relative m-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search courses..."
                    //   value={searchQuery}
                    //   onChange={handleSearch}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <h2 className='my-3 ml-2 font-bold'>Filter By: </h2>
            <h2 className='mt-2 ml-2 text-[14px] font-medium'>Course Categories</h2>
            <div className='w-[250px] h-[300px] m-5 border-2 bg-white'>
                <div className='grid'>
                    <div>
                    <input className='w-4 h-4 m-2'
                        type="checkbox"
                    />
                    <span className="text-sm font-medium text-gray-400">English</span>
                    </div>
                    <div>
                    <input className='w-4 h-4 m-2'
                        type="checkbox"
                    />
                    <span className="text-sm font-medium text-gray-400">Mathematics</span>
                    </div>
                    <div>
                    <input className='w-4 h-4 m-2'
                        type="checkbox"
                    />
                    <span className="text-sm font-medium text-gray-400">Computer Science</span>
                    </div>
                    <div>
                    <input className='w-4 h-4 m-2'
                        type="checkbox"
                    />
                    <span className="text-sm font-medium text-gray-400">Physics</span>
                    </div>
                    <div>
                    <input className='w-4 h-4 m-2'
                        type="checkbox"
                    />
                    <span className="text-sm font-medium text-gray-400">Chemistry</span>
                    </div>
                    <div>
                    <input className='w-4 h-4 m-2'
                        type="checkbox"
                    />
                    <span className="text-sm font-medium text-gray-400">Biology</span>
                    </div>
                    <div>
                    <input className='w-4 h-4 m-2'
                        type="checkbox"
                    />
                    <span className="text-sm font-medium text-gray-400">Botany</span>
                    </div>
                    <div>
                    <input className='w-4 h-4 m-2'
                        type="checkbox"
                    />
                    <span className="text-sm font-medium text-gray-400">Economics</span>
                    </div>
                    <div>
                    <input className='w-4 h-4 m-2'
                        type="checkbox"
                    />
                    <span className="text-sm font-medium text-gray-400">Commerce</span>
                    </div>
                </div>
            </div>
            <h2 className='mt-2 ml-2 text-[14px] font-medium'>Popular College</h2>
            <div className='w-[250px] h-[300px] m-5 border-2 bg-white'>
                <div className='grid'>
                    <div>
                    <input className='w-4 h-4 m-2'
                        type="checkbox"
                    />
                    <span className="text-sm font-medium text-gray-400">CET</span>
                    </div>
                    <div>
                    <input className='w-4 h-4 m-2'
                        type="checkbox"
                    />
                    <span className="text-sm font-medium text-gray-400">TKM</span>
                    </div>
                    <div>
                    <input className='w-4 h-4 m-2'
                        type="checkbox"
                    />
                    <span className="text-sm font-medium text-gray-400">GEC Kannur</span>
                    </div>
                    <div>
                    <input className='w-4 h-4 m-2'
                        type="checkbox"
                    />
                    <span className="text-sm font-medium text-gray-400">Maharajas</span>
                    </div>
                    <div>
                    <input className='w-4 h-4 m-2'
                        type="checkbox"
                    />
                    <span className="text-sm font-medium text-gray-400">MCC</span>
                    </div>
                    <div>
                    <input className='w-4 h-4 m-2'
                        type="checkbox"
                    />
                    <span className="text-sm font-medium text-gray-400">Model</span>
                    </div>
                    <div>
                    <input className='w-4 h-4 m-2'
                        type="checkbox"
                    />
                    <span className="text-sm font-medium text-gray-400">KMCT</span>
                    </div>
                    <div>
                    <input className='w-4 h-4 m-2'
                        type="checkbox"
                    />
                    <span className="text-sm font-medium text-gray-400">MDIT</span>
                    </div>
                    <div>
                    <input className='w-4 h-4 m-2'
                        type="checkbox"
                    />
                    <span className="text-sm font-medium text-gray-400">AWH</span>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default UserCoursePage