import "./css/addpaddle.css"
import { useState, useActionState, useEffect } from 'react';
import { GoStar, GoStarFill } from "react-icons/go";
import { useAuth } from '../Auth/AuthProvider';
import { supabase } from '../supabase/supabase-client';
import { useParams, useNavigate } from 'react-router';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';

export default function EditPaddle() {
    //State
    let defaultStarArr = [<GoStar />, <GoStar />, <GoStar />, <GoStar />, <GoStar />]
    const [starArr, setStarArr] = useState(defaultStarArr)
    const [isFormSubmitted, setIsFormSubmitted] = useState(false)
    const [paddle, setPaddle] = useState(undefined)
    const [otherError, setOtherError] = useState(null)

    // Derived flag from the state
    let isLoading = false
    let noData = false

    if (paddle === undefined) {
        isLoading = true
    } else if (paddle.length === 0) {
        noData = true
    }

    // Params
    const { id } = useParams()

    // use Auth
    const { session } = useAuth()

    // use navigate
    const navigate = useNavigate()

    // Action State
    const [error, formAction, isPending] = useActionState(
        async (prevError, formData) => {

            try {
                let formObject = Object.fromEntries(formData.entries())
                formObject = {
                    ...formObject,
                    condition: Number(formData.get('condition')),
                    brand: formData.get('brand')[0].toUpperCase() + formData.get('brand').slice(1),
                    status: 'submitted'
                }

                const { error } = await supabase
                    .from('items')
                    .update(formObject)
                    .eq('id', id)

                setStarArr(defaultStarArr)
                setIsFormSubmitted(true)
                if (error) {
                    throw error
                }
                return null
            }
            catch (error) {
                window.scrollTo(0, document.body.scrollHeight) // scroll to bottom
                return error
            }
        },
        null
    )

    // Effect
    useEffect(() => {
        async function fetchData() {
            try {
                const { data, error } = await supabase.from('items')
                    .select()
                    .eq('id', id) // Look for the particular item
                    .eq('user_id', session?.user?.id) // Can only edit your own data
                    .neq('status', 'submitted') // Cannot edit data that is submitted 
                if (error) {
                    throw error
                }

                setOtherError(null)
                setPaddle(data)
                data.length > 0 && handleStarChange(null, data[0].condition)
            }
            catch (err) {
                setOtherError(err)
            }
        }

        window.scrollTo(0, 0) // Scroll to top on first render
        fetchData()
    }, [])

    useEffect(() => {
        if (noData) {
            navigate("/user")
        } else if (isFormSubmitted && !error) {
            navigate("/user/paddles")
        }
    }, [noData, isFormSubmitted, error])

    // Functions
    function handleStarChange(event, fetchedRating = null) {

        let selectedRating = ""
        if (event) selectedRating = Number(event.target.value)
        else if (fetchedRating) selectedRating = fetchedRating

        const newStarArr = []
        for (let i = 0; i < selectedRating; i++) {
            newStarArr.push(<GoStarFill />)
        }
        for (let i = selectedRating; i < 5; i++) {
            newStarArr.push(<GoStar />)
        }

        setStarArr(newStarArr)
    }



    // Elements


    let displayedElement = ""
    if (paddle?.length > 0) {

        const starElements = starArr.map((element, idx, arr) => {
            return (
                <div key={`key-${idx + 1}`} className='star-el-div'>
                    <input
                        type='radio'
                        name='condition'
                        id={`condition-${idx + 1}`}
                        value={idx + 1}
                        onClick={(event) => { handleStarChange(event) }}
                        defaultChecked={paddle[0].condition === (idx + 1)}
                        required
                        disabled={isPending}
                    />

                    <label
                        htmlFor={`condition-${idx + 1}`}
                        className='star-el'
                    >
                        {element}
                    </label>
                </div>
            )
        })

        displayedElement = (
            <form className='user-child-sec add-form' action={formAction}>

                <div className='add-form-outer'>
                    <span className='add-form-title'>Edit Your Paddle</span>

                    <div className='add-form-inner'>

                        <div className='add-form-input-outer-div'>

                            <span className='inpt-div-title'>
                                Paddle's information
                            </span>

                            <div className='add-form-inpt-div'>
                                <label
                                    htmlFor="name"
                                >
                                    Paddle's Name:
                                </label>

                                <input
                                    type='text'
                                    name='name'
                                    id='name'
                                    className='add-form-inpt name'
                                    defaultValue={paddle[0].name}
                                    required
                                    disabled={isPending}
                                />
                            </div>

                            <div className='detail-sub-div'>

                                <div className='add-form-inpt-div'>
                                    <label
                                        htmlFor="type"
                                    >
                                        Paddle's Type:
                                    </label>

                                    <select name="type" id="type" className='add-form-inpt' defaultValue={paddle[0].type}>
                                        <option value="Balanced">Balanced</option>
                                        <option value="Control">Control</option>
                                        <option value="Power">Power</option>
                                    </select>
                                </div>

                                <div className='add-form-inpt-div'>
                                    <label
                                        htmlFor="brand"
                                    >
                                        Paddle's Brand:
                                    </label>

                                    <input
                                        type='text'
                                        name='brand'
                                        id='brand'
                                        className='add-form-inpt'
                                        defaultValue={paddle[0].brand}
                                        required
                                        disabled={isPending}
                                    />
                                </div>

                            </div>

                        </div>

                        <div className='add-form-input-outer-div'>

                            <span className='inpt-div-title'>
                                Paddle's condition
                            </span>

                            <div className='add-form-inpt-div'>
                                <label
                                    htmlFor="img"
                                >
                                    Paddle's Image Link:
                                </label>

                                <input
                                    type='text'
                                    name='img'
                                    id='img'
                                    className='add-form-inpt image'
                                    defaultValue={paddle[0].img}
                                    required
                                    disabled={isPending}
                                />
                            </div>

                            <div className='add-form-inpt-div'>
                                <label>
                                    Rate your paddle's condition from 1 to 5:
                                </label>

                                <div className='condition-div'>
                                    {starElements}
                                </div>
                            </div>

                        </div>

                        <div className='add-form-input-outer-div'>
                            <span className='inpt-div-title'>
                                Paddle's price
                            </span>

                            <div className='add-form-inpt-div'>
                                <label
                                    htmlFor="price"
                                >
                                    Available for rental at:
                                </label>

                                <div className='price-div'>
                                    MYR
                                    <input
                                        type='number'
                                        step='0.01'
                                        name='price'
                                        id='price'
                                        className='add-form-inpt price'
                                        defaultValue={paddle[0].price}
                                        required
                                        disabled={isPending}
                                    />
                                    per day
                                </div>
                            </div>
                        </div>

                        <div className='add-form-input-outer-div'>

                            <span className='inpt-div-title'>
                                Paddle's description
                            </span>

                            <div className='add-form-inpt-div'>
                                <label
                                    htmlFor="description"
                                >
                                    Why should the users try this paddle:
                                </label>

                                <textarea
                                    name='description'
                                    id='description'
                                    className='add-form-inpt description'
                                    rows="5"
                                    maxLength="300"
                                    defaultValue={paddle[0].description}
                                    required
                                    disabled={isPending}
                                >
                                </textarea>
                            </div>
                        </div>

                        <button
                            type='submit'
                            className='btn list-btn'
                            disabled={isPending}
                        >
                            Add for Review / Approval
                        </button>

                        {
                            error ?
                                <span className='list-hint error-hint'>
                                    {error.name}: {error.message}
                                </span> :
                                <span className='list-hint'>
                                    {
                                        isFormSubmitted ?
                                            "Your form has been submitted." :
                                            "The review process may take up to 3 working days before it gets listed again."
                                    }
                                </span>
                        }

                    </div>
                </div>

            </form>
        )
    }


    return (
        otherError ?
            <Error error={otherError} isUserChild={true} /> :
            isLoading ?
                <Loading isUserChild={true} /> :
                displayedElement
    )
}