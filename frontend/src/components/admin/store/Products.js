import React, {Fragment, useState} from 'react'
import {
    Image,
    Form,
    Input,
    Select,
    Upload,
    Button,
    Alert,
    Spin,
    Tabs, message,
} from 'antd'
import Title from 'antd/es/typography/Title'
import {LoadingOutlined, CloseOutlined} from '@ant-design/icons'

import FallbackImage from '../../../img/fallback-image.png'

const Option = {Select}

const Products = (props) => {
    const {changeTab, productDetails} = props

    const initialValue = {
        category: '',
        brand: '',
        model: '',
        available: '',
        weight: {
            value: '',
            unit: 'g',
        },
        dimensions: {
            width: '',
            height: '',
            length: '',
            unit: 'mm',
        },
        description: '',
        price: '',
    }

    const [image, setImage] = useState('')
    const [fileList, setFileList] = useState([])
    const [imageError, setImageError] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [progress, setProgress] = useState(false)

    const [form] = Form.useForm()

    form.setFieldsValue(productDetails)
    let base64ImageList =
        productDetails && productDetails.images ? productDetails.images : []

    const onSelect = (image) => {
        setImage(image)
    }

    const submitForm = async (value) => {
        setImageError(false)
        if (fileList.length !== 0 || base64ImageList.length !== 0) {
            Promise.all(
                fileList.map(
                    (image) =>
                        new Promise((resolve) => {
                            getBase64(image.originFileObj, (result) => {
                                resolve(result)
                            })
                        })
                )
            ).then((base64Images) => {
                setError('')
                setSuccess(false)
                setProgress(true)
                fetch('/api/store/add-product', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        productID: productDetails._id,
                        productDetails: value,
                        images: base64Images.concat(base64ImageList),
                    }),
                })
                    .then((response) => {
                        setProgress(false)
                        if (response.status !== 200) {
                            throw new Error(response.statusText.toString())
                        }
                        return response.json()
                    })

                    // edit msg
                    .then((data) => {
                        setSuccess(true)
                        setFileList([])
                        changeTab()
                        message.success({
                            content: 'Product saved successfully..!',
                            style: {
                                marginTop: '90vh',
                            },
                        })
                    })
                    .catch((error) => {
                        setError('Error saving data')
                    })
            })
        } else {
            setImageError(true)
        }
    }

    return (
        <Fragment>
            <Title level={3}>Add New Products</Title>

            <div className='row mx-0 px-0'>
                <div className='col-lg-4 mx-0 px-0'>
                    <h6>
                        Upload Images<span className='text-danger'>*</span>
                    </h6>
                    <div className='row mx-0 px-0 my-2'>
                        <ImagePreview image={image}/>
                    </div>
                    <div className='row mx-0 px-0 my-2 d-flex justify-content-start'>
                        <div
                            className='row mx-0 d-flex'
                            style={{padding: '10px 8px 10px 8px'}}
                        >
                            {base64ImageList &&
                            base64ImageList.map((image) => (
                                <div
                                    style={{height: '103px', width: '103px', margin: '4px'}}
                                    className='border rounded'
                                >
                                    <CloseOutlined
                                        style={{position: 'absolute', marginTop: '10px'}}
                                    />
                                    <img
                                        src={image}
                                        alt='image'
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            overflow: 'hidden',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        <ImageUpload
                            onSelect={onSelect}
                            fileList={fileList}
                            setFileList={setFileList}
                        />
                    </div>
                    <div className='row mx-1 px-2 my-2'>
                        {imageError ? (
                            <Alert message='please add at least on image.' type='error'/>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                <div className='col-lg-8 mx-0 px-0 d-flex justify-content-start'>
                    <ProductForm
                        onSubmit={submitForm}
                        form={form}
                        initialValue={initialValue}
                        error={error}
                        success={success}
                        progress={progress}
                    />
                </div>
            </div>
        </Fragment>
    )
}

function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
}

const ImagePreview = (props) => {
    const image = props.image
    return (
        <Image
            style={{objectFit: 'cover', width: '100%', aspectRatio: '1'}}
            src={image}
            fallback={FallbackImage}
        />
    )
}

const ImageUpload = (props) => {
    console.log(props.fileList)

    const handleChange = (info) => {
        props.setFileList(info.fileList)
        if (info.fileList[0]) {
            preview(info.fileList[0])
        }
    }

    const preview = (file) => {
        const image = props.fileList.find((item) => item.uid === file.uid)
        if (image) {
            getBase64(image.originFileObj, (result) => {
                props.onSelect(result)
            })
        }
    }

    const remove = (file) => {
        const index = props.fileList.indexOf(file)
        if (props.fileList.length > 1) {
            preview(props.fileList[(index + 1) % props.fileList.length])
        } else {
            props.onSelect('')
        }
    }

    const dummyRequest = ({onSuccess}) => {
        setTimeout(() => {
            onSuccess('ok')
        }, 0)
    }

    return (
        <Upload
            name='avatar'
            listType='picture-card'
            className='avatar-uploader'
            customRequest={dummyRequest}
            fileList={props.fileList}
            multiple={true}
            onPreview={preview}
            onRemove={remove}
            onChange={handleChange}
        >
            {props.fileList.length < 5 && '+ Upload'}
        </Upload>
    )
}

const ProductForm = (props) => {
    const {form, initialValue, onSubmit, error, success, progress} = props

    const resetForm = () => {
        form.setFieldsValue({})
    }

    //demo
    const demo = () => {
        form.setFieldsValue({
            category: 'Mobile',
            brand: 'Samsung',
            model: 'Galaxy S2',
            available: '10',
            weight: {
                unit: 'g',
                value: '150'
            },
            dimensions: {
                width: '150',
                height: '10',
                length: '100',
                unit: 'mm'
            },
            description: 'This is a description',
            price: '10000'
        });
    }

    return (
        <Form
            layout='vertical'
            name='productForm'
            form={form}
            initialValues={initialValue}
            onFinish={onSubmit}
            autoComplete='off'
            style={{width: '100%', margin: '20px'}}
        >
            <Form.Item
                name='category'
                label='Category'
                rules={[{required: true, message: 'This filed is required.'}]}
            >
                <Select placeholder='Select a category'>
                    <Option value='Mobile'>Smart Phone</Option>
                    <Option value='Television'>Television</Option>
                    <Option value='Laptop'>Laptop</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name='brand'
                label='Brand'
                rules={[{required: true, message: 'This filed is required.'}]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                name='model'
                label='Model'
                rules={[{required: true, message: 'This filed is required.'}]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                name='available'
                label='Available Amount'
                rules={[{required: true, message: 'This filed is required.'}]}
            >
                <Input type='number'/>
            </Form.Item>

            <Form.Item label='Weight' style={{marginBottom: 0}}>
                <Input.Group>
                    <Form.Item
                        style={{display: 'inline-block', width: 'calc(100% - 80px)'}}
                        name={['weight', 'value']}
                    >
                        <Input type='number'/>
                    </Form.Item>

                    <Form.Item
                        style={{display: 'inline-block'}}
                        name={['weight', 'unit']}
                    >
                        <Select style={{width: '70px', marginLeft: '10px'}}>
                            <Option value='kg'>kg</Option>
                            <Option value='g'>g</Option>
                        </Select>
                    </Form.Item>
                </Input.Group>
            </Form.Item>

            <Form.Item label='Dimensions' style={{marginBottom: '0'}}>
                <Input.Group>
                    <Form.Item
                        name={['dimensions', 'width']}
                        style={{display: 'inline-block', width: 'calc(32.5% - 32px)'}}
                    >
                        <Input placeholder='Width' type='number'/>
                    </Form.Item>

                    <span
                        style={{
                            display: 'inline-block',
                            width: '16px',
                            lineHeight: '32px',
                            textAlign: 'center',
                        }}
                    >
            x
          </span>

                    <Form.Item
                        name={['dimensions', 'height']}
                        style={{display: 'inline-block', width: 'calc(32.5% - 32px)'}}
                    >
                        <Input placeholder='Height' type='number'/>
                    </Form.Item>

                    <span
                        style={{
                            display: 'inline-block',
                            width: '16px',
                            lineHeight: '32px',
                            textAlign: 'center',
                        }}
                    >
            x
          </span>

                    <Form.Item
                        name={['dimensions', 'length']}
                        style={{display: 'inline-block', width: 'calc(32.5% - 32px)'}}
                    >
                        <Input placeholder='Length' type='number'/>
                    </Form.Item>

                    <Form.Item
                        style={{display: 'inline-block'}}
                        name={['dimensions', 'unit']}
                    >
                        <Select style={{width: 70, marginLeft: '10px'}}>
                            <Option value='m' selected>
                                m
                            </Option>
                            <Option value='mm'>mm</Option>
                        </Select>
                    </Form.Item>
                </Input.Group>
            </Form.Item>

            <Form.Item
                name='description'
                label='Description'
                rules={[{required: true, message: 'This filed is required.'}]}
            >
                <Input.TextArea placeholder='Enter product description'/>
            </Form.Item>

            <Form.Item
                name='price'
                label='Price'
                style={{marginBottom: '15px'}}
                rules={[{required: true, message: 'This filed is required.'}]}
            >
                <Input addonAfter={<span>$</span>} type='number'/>
            </Form.Item>

            <div className='mb-3'>
                {error ? <Alert type='error' message={error}/> : <></>}
                {success ? (
                    <Alert
                        type='success'
                        message='Product successfully added to the store!'
                    />
                ) : (
                    <></>
                )}
            </div>

            <Form.Item>
                <Button type='primary' htmlType='submit'>
                    Submit
                </Button>
                <Button
                    className='mx-2'
                    type='secondary'
                    htmlType='reset'
                    onClick={resetForm}
                >
                    Reset
                </Button>
                <Button htmlType="button" type="secondary" onClick={demo}>Demo</Button>
                {progress ? (
                    <LoadingOutlined
                        className="mx-2"
                        style={{fontSize: '24px', marginLeft: '10px'}}
                        spin
                    />
                ) : (
                    <></>
                )}
            </Form.Item>
        </Form>
    )
}

export default Products
