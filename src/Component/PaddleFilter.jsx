
import "./css/paddlefilter.css"
import { translation } from '../misc/translation'
import { FaMagnifyingGlass } from "react-icons/fa6";
import { TiArrowUnsorted } from "react-icons/ti";
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import { BsSortNumericDown, BsSortNumericUp } from "react-icons/bs";

export default function PaddleFilter({ types, searchParams, setSearchParams }) {

    // Functions
    function handleFilter(event, type) {
        const isActive = event.currentTarget.classList.contains('isActive')
        if (isActive) {
            setSearchParams((sp) => {
                sp.delete('type')
                return sp
            }) //Clear the filter
        }
        else {
            setSearchParams((sp) => {
                sp.set('type', type)
                return sp
            }) // Set the filter for type
        }
    }

    function handleSearch(event) {
        const hasNoSearchValue = event.currentTarget.value === ''
        if (hasNoSearchValue) {
            setSearchParams((sp) => {
                sp.delete('search')
                return sp
            })
        }
        else {
            setSearchParams((sp) => {
                sp.set('search', event.currentTarget.value)
                return sp
            })
        }
    }

    function handleSortName() {

        const sortNameVal = searchParams.get('sortName')

        if (sortNameVal === 'true') {
            setSearchParams((sp) => {
                sp.set('sortName', 'false')
                return sp
            })
        }
        else if (sortNameVal === 'false') {
            setSearchParams((sp) => {
                sp.delete('sortName')
                return sp
            })
        }
        else {
            setSearchParams((sp) => {
                sp.set('sortName', 'true')
                return sp
            })
        }
    }

    function handleSortPrice() {

        const sortPriceVal = searchParams.get('sortPrice')

        if (sortPriceVal === 'true') {
            setSearchParams((sp) => {
                sp.set('sortPrice', 'false')
                return sp
            })
        }
        else if (sortPriceVal === 'false'){
            setSearchParams((sp) => {
                sp.delete('sortPrice')
                return sp
            })
        }
        else {
            setSearchParams((sp) => {
                sp.set('sortPrice', 'true')
                return sp
            })
        }
    }

    function handleClear() {
        setSearchParams({})
    }

    // Flag derived from searchParams
    let isNameSortedAsc = null
    let sortNameActiveClass = ''
    if (searchParams.get('sortName') === 'true' || searchParams.get('sortName') === 'false') {
        isNameSortedAsc = searchParams.get('sortName')
        sortNameActiveClass = 'active-sort'
    }

    let isPriceSortedAsc = null
    let sortPriceActiveClass = ''
    if (searchParams.get('sortPrice') === 'true' || searchParams.get('sortPrice') === 'false') {
        isPriceSortedAsc = searchParams.get('sortPrice')
        sortPriceActiveClass = 'active-sort'
    }


    // Elements to be returned
    const typeFilters = types.map((type) => {
        let activeClass = ''
        if (searchParams.get('type') === type) {
            activeClass = `${type[0].toLowerCase() + type.slice(1)} isActive` //'power', 'balanced', 'control'
        }

        return (
            <div
                className={`filter-btn ${activeClass}`}
                onClick={(event) => { handleFilter(event, type) }}
                key={type}
            >
                {type} / {translation(type)}
            </div>
        )
    })

    const searchFilters = (
        <div className='search-box'>
            <FaMagnifyingGlass />
            <input
                type='text'
                className='search-entry'
                placeholder='Enter your search...'
                onChange={(event) => { handleSearch(event) }} />
        </div>
    )


    const sortNameBtn = (
        <div
            className={`sort-btn ${sortNameActiveClass}`}
            onClick={() => { handleSortName() }}
        >
            {
                isNameSortedAsc === null
                    ? <TiArrowUnsorted />
                    : isNameSortedAsc === 'true'
                        ? <AiOutlineSortAscending />
                        : <AiOutlineSortDescending />
            }

            Name
        </div>
    )

    const sortPriceBtn = (
        <div
            className={`sort-btn ${sortPriceActiveClass}`}
            onClick={() => { handleSortPrice() }}
        >
            {
                isPriceSortedAsc === null
                    ? <TiArrowUnsorted />
                    : isPriceSortedAsc === 'true'
                        ? <BsSortNumericDown />
                        : <BsSortNumericUp />
            }

            Price
        </div>
    )

    const clearBtn = (
        <span
            className='clear-btn'
            onClick={() => { handleClear() }}
        >
            Clear all filter
        </span>
    )

    // Return 
    return (
        <div className='filter-sec'>
            <div className='search-group'>
                <span className='search-group-title'>Filtered by paddle type: </span>
                {typeFilters}
            </div>
            <div className='search-group'>
                <span className='search-group-title'>Sort by: </span>
                {sortNameBtn}
                {sortPriceBtn}
            </div>
            {searchFilters}
            {clearBtn}
        </div>
    )
}

