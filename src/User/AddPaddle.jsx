
import "./css/addpaddle.css"
import { useState, useActionState } from 'react';
import { GoStar, GoStarFill } from "react-icons/go";
import { useAuth } from '../Auth/AuthProvider';
import { supabase } from '../supabase/supabase-client';

export default function AddPaddle() {

    //State
    let defaultStarArr = [<GoStar />, <GoStar />, <GoStar />, <GoStar />, <GoStar />]
    const [starArr, setStarArr] = useState(defaultStarArr)
    const [isFormSubmitted, setIsFormSubmitted] = useState(false)

    // use Auth
    const { session } = useAuth()

    // Action State
    const [error, formAction, isPending] = useActionState(
        async (prevError, formData) => {

            try{
                let formObject = Object.fromEntries(formData.entries())
                formObject = {
                    ...formObject,
                    condition: Number(formData.get('condition')),
                    brand: formData.get('brand')[0].toUpperCase() + formData.get('brand').slice(1),
                    user_id: session.user.id,
                    status: 'submitted'
                }
                console.log(formObject)
    
                const {error} = await supabase
                    .from('items')
                    .insert(formObject)
                
                setStarArr(defaultStarArr)
                setIsFormSubmitted(true)
                if(error){
                    throw error
                }
                window.scrollTo(0, document.body.scrollHeight) // scroll to bottom
                return null
            }
            catch(error){
                window.scrollTo(0, document.body.scrollHeight) // scroll to bottom
                return error
            }
        },
        null
    )


    // Functions
    function handleStarChange(event) {

        const selectedRating = Number(event.target.value)

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
    const starElements = starArr.map((element, idx, arr) => {
        return (
            <div key={`key-${idx + 1}`} className='star-el-div'>
                <input
                    type='radio'
                    name='condition'
                    id={`condition-${idx + 1}`}
                    value={idx + 1}
                    onClick={(event) => { handleStarChange(event) }}
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

    const displayedElement = (
        <form className='user-child-sec add-form' action={formAction}>

            <div className='add-form-outer'>
                <span className='add-form-title'>List a New Paddle for Rental</span>

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

                                <select name="type" id="type" className='add-form-inpt'>
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
                                "Your form has been submitted.":
                                "The review process may take up to 3 working days before it gets listed."
                            }
                        </span>
                    }

                </div>
            </div>

        </form>
    )


    return (
        displayedElement
    )
}