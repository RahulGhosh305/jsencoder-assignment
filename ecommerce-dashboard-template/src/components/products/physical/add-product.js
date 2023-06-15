import React, { Fragment, useEffect, useState } from "react";
import axios from 'axios';
import Breadcrumb from "../../common/breadcrumb";
import {
	Card,
	CardBody,
	CardHeader,
	Col,
	Container,
	Form,
	FormGroup,
	Input,
	Label,
	Row,
	Button,
} from "reactstrap";
import one from "../../../assets/images/pro3/1.jpg";
import userImg from "../../../assets/images/user.png";
import MDEditor from "@uiw/react-md-editor";

const Add_product = () => {
	const [userData, setUserData] = useState(null);
	const [responseImage, setResponseImage] = useState(null);
	const [value, setValue] = useState('')
	const [quantity, setQuantity] = useState(1);
	const [images, setImages] = useState([])
	const [file, setFile] = useState();

	const [colorName, setColorName] = useState('');
	const [colorCode, setColorCode] = useState('');
	const [id, setId] = useState('');
	const [imageId, setImageId] = useState('');
	const [size, setSize] = useState("");
	const [sku, setSku] = useState('');
	const [stock, setStock] = useState(null);
	const [productId, setProductId] = useState("")
	const [response, setResponse] = useState("")

	const handleSingleVariantSubmit = async (event) => {
		event.preventDefault();
		const variant = {
			color: {
				color_name: colorName,
				color_code: colorCode,
			},
			id: id,
			image_id: Number(imageId),
			sku: sku,
			size: {
				size: size,
				stock: Number(stock)
			}
		}

		try {
			fetch(`http://localhost:9001/api/products/add-variant?productId=${productId}`, {
				method: 'POST',
				body: JSON.stringify({ variant }),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			})
				.then(res => res.json())
				.then(data => console.log(data))
			// Reset form values
			setColorName('');
			setColorCode('');
			setId('');
			setImageId('');
			setSize('');
			setSku('');
			setStock('');
			setProductId("")
		} catch (error) {
			console.error('Error creating product:', error);
		}
	};

	const [dummyimgs, setDummyimgs] = useState([
		{ img: userImg },
		{ img: userImg },
		{ img: userImg },
		{ img: userImg },
		{ img: userImg },
		{ img: userImg },
	]);

	const [productData, setProductData] = useState({
		name: "",
		brand: "",
		price: "",
		discount: "",
		type: "",
		availability: "",
		category: "",
		sale: "",
		new: "",
		variants: [],
		ratings: [],
		reviews: []
	});


	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axios.get('http://localhost:9001/api/users/all', {
					headers: {
						authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsInBob25lIjoiKzEgMTIzLTQ1Ni03ODkwIiwiaWF0IjoxNjg2Nzk5NzExfQ.jGTZUy6nRy5EDI1DdzXL64xnFDq8ESt44HHSD-060KY',
					},
				});

				setUserData(response?.data?.data?.results);
			} catch (error) {
				console.error(error);
			}
		};

		fetchUserData();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setProductData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const addVariant = () => {
		setProductData((prevData) => ({
			...prevData,
			variants: [...prevData.variants, {}]
		}));
	};

	const handleVariantChange = (index, field, value) => {
		setProductData((prevData) => {
			const variants = [...prevData.variants];
			variants[index][field] = value;
			return { ...prevData, variants };
		});
	};


	const addRating = () => {
		setProductData((prevData) => ({
			...prevData,
			ratings: [...prevData.ratings, {}]
		}));
	};

	const handleRatingChange = (index, field, value) => {
		setProductData((prevData) => {
			const ratings = [...prevData.ratings];
			ratings[index][field] = value;
			return { ...prevData, ratings };
		});
	};

	const addReview = () => {
		setProductData((prevData) => ({
			...prevData,
			reviews: [...prevData.reviews, {}]
		}));
	};

	const handleaddReviewChange = (index, field, value) => {
		setProductData((prevData) => {
			const reviews = [...prevData.reviews];
			reviews[index][field] = value;
			return { ...prevData, reviews };
		});
	};

	const onChange = (e) => {
		setValue(e)
	}

	const IncrementItem = () => {
		if (quantity < 9) {
			setQuantity(quantity + 1);
		} else {
			return null;
		}
	};
	const DecreaseItem = () => {
		if (quantity > 0) {
			setQuantity(quantity - 1);
		} else {
			return null;
		}
	};
	const handleChange = (event) => {
		setQuantity(event.target.value);
	};

	//	image upload
	const handleImageUpload = (e) => {
		const Image = e.target.files[0];
		if (Image) {
			const formData = new FormData();
			formData.append('file', Image);

			fetch('http://localhost:9001/api/file/upload', {
				method: 'POST',
				body: formData
			})
				.then(response => response.json())
				.then(data => {
					// console.log(data);
					setResponseImage(data)
					setImages([...images, data])
				})
				.catch(error => {
					console.error(error);
				});
		}
	}

	const _handleImgChange = (e, i) => {
		e.preventDefault();
		let reader = new FileReader();
		const image = e.target.files[0];
		reader.onload = () => {
			dummyimgs[i].img = reader.result;
			setFile({ file: file });
			setDummyimgs(dummyimgs);
			handleImageUpload(e)
		};
		reader.readAsDataURL(image);
	};

	const handleValidSubmit = async (e) => {
		e.preventDefault();
		const postData = {
			...productData,
			price: Number(productData.price),
			discount: Number(productData.discount),
			sale: Boolean(productData.sale),
			new: Boolean(productData.new),
			quantity,
			description: value,
			images,
		}


		try {
			const response = await axios.post('http://localhost:9001/api/products/', {
				...postData
			});

			console.log(response.data);
			setProductId(response?.data?._id)
			setResponse(response?.data)
		} catch (error) {
			console.error(error);
		}

	};

	return (
		<Fragment>
			<Breadcrumb title="Add Product" parent="Physical" />

			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>
							<CardHeader>
								<h5>Add Product</h5>
							</CardHeader>
							<CardBody>
								<Row className="product-adding">
									<Col xl="5">
										<div className="add-product">
											<Row>
												<Col xl="9 xl-50" sm="6 col-9">
													<img
														src={responseImage?.src ? `http://localhost:9001/files/${responseImage?.src?.slice(22)}` : one}
														alt=""
														className="img-fluid image_zoom_1 blur-up lazyloaded"
													/>
												</Col >
												<Col xl="3 xl-50" sm="6 col-3">
													<ul className="file-upload-product">
														{dummyimgs.map((res, i) => {
															return (
																<li key={i}>
																	<div className="box-input-file">
																		<Input
																			className="upload"
																			type="file"
																			name="file"
																			onChange={(e) => _handleImgChange(e, i)}
																		/>
																		<img
																			alt=""
																			src={res.img}
																			style={{ width: 50, height: 50 }}
																		/>
																	</div>
																</li>
															);
														})}
													</ul>
												</Col>
											</Row >
										</div >
									</Col >

									{/*  */}

									{

										productId && <div className="mb-3">
											<h4>Product Name: {response?.name}</h4>
											<h4>Product Id: {productId}</h4>
										</div>}
									{
										productId && <Form onSubmit={handleSingleVariantSubmit} >
											<FormGroup className="form-group mb-3 row">
												<Label className="col-xl-3 col-sm-4 mb-0">
													Color Name:
												</Label>
												<div className="col-xl-8 col-sm-7">
													<Input type="text" className="form-control" value={colorName} onChange={(e) => setColorName(e.target.value)} />
												</div>
												<div className="valid-feedback">Looks good!</div>
											</FormGroup>

											<FormGroup className="form-group mb-3 row">
												<Label className="col-xl-3 col-sm-4 mb-0">
													Color Code:
												</Label>
												<div className="col-xl-8 col-sm-7">
													<Input type="text" className="form-control" value={colorCode} onChange={(e) => setColorCode(e.target.value)} />
												</div>
												<div className="valid-feedback">Looks good!</div>
											</FormGroup>

											<br />
											<FormGroup className="form-group mb-3 row">
												<Label className="col-xl-3 col-sm-4 mb-0">
													ID:
												</Label>
												<div className="col-xl-8 col-sm-7">
													<Input type="text" className="form-control" value={id} onChange={(e) => setId(e.target.value)} />
												</div>
												<div className="valid-feedback">Looks good!</div>
											</FormGroup>

											<br />
											<FormGroup className="form-group mb-3 row">
												<Label className="col-xl-3 col-sm-4 mb-0">
													Image ID:
												</Label>
												<div className="col-xl-8 col-sm-7">
													<select
														className="form-control digits mb-2"
														onChange={(e) => setImageId(e.target.value)}
													>
														<option value="">Select Image_Id</option>
														{response?.images?.map((image) => (
															<option key={image._id} value={image.image_id}>{
																image._id
															}</option>

														))}
													</select>
												</div>
												<div className="valid-feedback">Looks good!</div>
											</FormGroup>

											<br />
											<FormGroup className="form-group mb-3 row">
												<Label className="col-xl-3 col-sm-4 mb-0">
													Size:
												</Label>
												<div className="col-xl-8 col-sm-7">
													<Input type="text" className="form-control" value={size} onChange={(e) => setSize(e.target.value)} />
												</div>
												<div className="valid-feedback">Looks good!</div>
											</FormGroup>

											<br />
											<FormGroup className="form-group mb-3 row">
												<Label className="col-xl-3 col-sm-4 mb-0">
													SKU:
												</Label>
												<div className="col-xl-8 col-sm-7">
													<Input type="text" className="form-control" value={sku} onChange={(e) => setSku(e.target.value)} />
												</div>
												<div className="valid-feedback">Looks good!</div>
											</FormGroup>
											<br />
											<FormGroup className="form-group mb-3 row">
												<Label className="col-xl-3 col-sm-4 mb-0">
													Stock:
												</Label>
												<div className="col-xl-8 col-sm-7">
													<Input type="number" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)} />
												</div>
												<div className="valid-feedback">Looks good!</div>
											</FormGroup>

											<br />
											<Button type="submit" color="primary">
												Create Variant
											</Button>
										</Form >
									}

									{/*  */}

									<Col xl="7" >
										{
											!productId && <Form
												className="needs-validation add-product-form"
												onSubmit={handleValidSubmit}
											>
												<div className="form form-label-center">
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															Product Name :
														</Label>
														<div className="col-xl-8 col-sm-7">
															<Input
																className="form-control"
																name="name"
																id="validationCustom01"
																type="text"
																onChange={(e) => handleInputChange(e)}
																required
															/>
														</div>
														<div className="valid-feedback">Looks good!</div>
													</FormGroup>
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															Brand :
														</Label>
														<div className="col-xl-8 col-sm-7">
															<Input
																className="form-control"
																name="brand"
																onChange={(e) => handleInputChange(e)}
																id="validationCustom01"
																type="text"
																required
															/>
														</div>
														<div className="valid-feedback">Looks good!</div>
													</FormGroup>
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															Price :
														</Label>
														<div className="col-xl-8 col-sm-7">
															<Input
																className="form-control mb-0"
																name="price"
																onChange={(e) => handleInputChange(e)}
																id="validationCustom02"
																type="number"
																required
															/>
														</div>
														<div className="valid-feedback">Looks good!</div>
													</FormGroup>
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															Discount :
														</Label>
														<div className="col-xl-8 col-sm-7">
															<Input
																className="form-control mb-0"
																name="discount"
																id="validationCustom03"
																onChange={(e) => handleInputChange(e)}
																type="number"
																required
															/>
														</div>
														<div className="valid-feedback">Looks good!</div>
													</FormGroup>
												</div>
												<div className="form">
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															Type :
														</Label>
														<div className="col-xl-8 col-sm-7">
															<select
																className="form-control digits"
																id="exampleFormControlSelect1"
																name="type"
																onChange={(e) => handleInputChange(e)}
															>
																<option value="">Select One</option>
																<option value="fashion">Fashion</option>
																<option value="electronics">Electronics</option>
																<option value="furniture">Furniture</option>
																<option value="jewellery">Jewellery</option>
																<option value="beauty">Beauty</option>
																<option value="tools">Tools</option>
																<option value="watch">Watch</option>
																<option value="shoes">Shoes</option>
																<option value="bags">Bags</option>
																<option value="kids">Kids</option>
																<option value="eyeware">Eyeware</option>
																<option value="light">Light</option>
																<option value="all">All</option>
															</select>
														</div>
													</FormGroup>
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															Category :
														</Label>
														<div className="col-xl-8 col-sm-7">
															<select
																className="form-control digits"
																id="exampleFormControlSelect1"
																onChange={(e) => handleInputChange(e)}
																name="category"
															>
																<option value="">Select One</option>
																<option value="Electronics">Electronics</option>
																<option value="Clothing">Clothing</option>
																<option value="Home">Home</option>
																<option value="Beauty">Beauty</option>
																<option value="Books">Books</option>
															</select>
														</div>
													</FormGroup>
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															Availability :
														</Label>
														<div className="col-xl-8 col-sm-7">
															<select
																className="form-control digits"
																id="exampleFormControlSelect1"
																name="availability"
																onChange={(e) => handleInputChange(e)}
															>
																<option value="">Select One</option>
																<option value="Available">Available</option>
																<option value="Out of stock">Out of stock</option>
															</select>
														</div>
													</FormGroup>
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															New :
														</Label>
														<div className="col-xl-8 col-sm-7">
															<select
																className="form-control digits"
																id="exampleFormControlSelect1"
																name="isNew"
																onChange={(e) => handleInputChange(e)}
															>
																<option value="">Select One</option>
																<option value="false">False</option>
																<option value="true">True</option>
															</select>
														</div>
													</FormGroup>
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															Sale :
														</Label>
														<div className="col-xl-8 col-sm-7">
															<select
																className="form-control digits"
																id="exampleFormControlSelect1"
																name="sale"
																onChange={(e) => handleInputChange(e)}
																required
															>
																<option value="">Select One</option>
																<option value="true">True</option>
																<option value="false">False</option>
															</select>
														</div>
													</FormGroup>
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															Total Quantity :
														</Label>
														<fieldset className="qty-box ms-0">
															<div className="input-group bootstrap-touchspin">
																<div className="input-group-prepend">
																	<Button
																		className="btn btn-primary btn-square bootstrap-touchspin-down"
																		type="button"
																		onClick={DecreaseItem}
																	>
																		<i className="fa fa-minus"></i>
																	</Button>
																</div>
																<div className="input-group-prepend">
																	<span className="input-group-text bootstrap-touchspin-prefix"></span>
																</div>
																<Input
																	className="touchspin form-control"
																	type="text"
																	value={quantity}
																	onChange={handleChange}
																/>
																<div className="input-group-append">
																	<span className="input-group-text bootstrap-touchspin-postfix"></span>
																</div>
																<div className="input-group-append ms-0">
																	<Button
																		className="btn btn-primary btn-square bootstrap-touchspin-up"
																		type="button"
																		onClick={IncrementItem}
																	>
																		<i className="fa fa-plus"></i>
																	</Button>
																</div>
															</div>
														</fieldset>
													</FormGroup>

													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															Variants :
														</Label>
														<div className="col-xl-8 col-sm-7">
															{productData.variants.map((variant, index) => (
																<div key={index}>
																	<h6>Variant {index + 1}</h6>
																	<Input
																		className="form-control mb-2"
																		type="text"
																		value={variant?.id || ''}
																		onChange={(e) => handleVariantChange(index, 'id', e.target.value)}
																		placeholder="Id"
																	/>
																	<Input
																		className="form-control mb-2"
																		type="text"
																		value={variant?.image_id || ''}
																		onChange={(e) => handleVariantChange(index, 'image_id', e.target.value)}
																		placeholder="Image_Id"
																	/>
																	<Input
																		className="form-control mb-2"
																		type="text"
																		value={variant?.sku || ''}
																		onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
																		placeholder="Sku"
																	/>
																	<Input
																		type="text"
																		className="form-control mb-2"
																		value={variant.color?.color_name || ''}
																		onChange={(e) => handleVariantChange(index, 'color', { ...variant.color, color_name: e.target.value })}
																		placeholder="color_name"
																	/>
																	<Input
																		className="form-control mb-2"
																		type="text"
																		value={variant.color?.color_code || ''}
																		onChange={(e) => handleVariantChange(index, 'color', { ...variant.color, color_code: e.target.value })}
																		placeholder="color_code"
																	/>
																	<Input
																		className="form-control mb-2"
																		type="text"
																		value={variant.size?.size || ''}
																		onChange={(e) => handleVariantChange(index, 'size', { ...variant.size, size: e.target.value })}
																		placeholder="size"
																	/>
																	<Input
																		className="form-control mb-2"
																		type="text"
																		value={variant.size?.stock || ''}
																		onChange={(e) => handleVariantChange(index, 'size', { ...variant.size, stock: e.target.value })}
																		placeholder="stock"
																	/>
																</div>
															))}
															<button type="button" color="light" onClick={addVariant}>
																Add Variant
															</button>
														</div>
													</FormGroup>

													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															Ratings :
														</Label>
														<div className="col-xl-8 col-sm-7">
															{productData.ratings.map((rating, index) => (
																<div key={index}>
																	<h6>Rating {index + 1}</h6>
																	<select
																		className="form-control digits mb-2"
																		onChange={(e) => handleRatingChange(index, 'rating', Number(e.target.value))}
																	>
																		<option value="">Select Rating</option>
																		{[1, 2, 3, 4, 5]?.map((option) => (
																			<option key={option?.id} value={option?.id}>
																				{option}
																			</option>
																		))}
																	</select>
																	<select
																		className="form-control digits mb-2"
																		onChange={(e) => handleRatingChange(index, 'user', e.target.value)}
																	>
																		<option value="">Select User</option>
																		{
																			userData?.map((user) => (<option key={user?._id} value={user?._id}>
																				{user.username}
																			</option>))
																		}
																	</select>
																</div>
															))}
															<button type="button" color="light" onClick={addRating}>
																Add Rating
															</button>
														</div>
													</FormGroup>
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															Review :
														</Label>
														<div className="col-xl-8 col-sm-7">
															{productData.reviews.map((review, index) => (
																<div key={index}>
																	<h6>Review {index + 1}</h6>
																	<Input
																		className="form-control mb-2"
																		type="text"
																		value={review?.review || ''}
																		onChange={(e) => handleaddReviewChange(index, 'review', e.target.value)}
																		placeholder="review"
																	/>
																	<select
																		className="form-control digits mb-2"
																		onChange={(e) => handleaddReviewChange(index, 'user', e.target.value)}
																	>
																		<option value="">Select User</option>
																		{
																			userData?.map((user) => (<option key={user?._id} value={user?._id}>
																				{user.username}
																			</option>))
																		}
																	</select>
																</div>
															))}
															<button type="button" color="light" onClick={addReview}>
																Add Review
															</button>
														</div>
													</FormGroup>

													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4">
															Add Description :
														</Label>
														<div className="col-xl-8 col-sm-7 description-sm">
															<MDEditor
																value={value}
																name="description"
																onChange={onChange}
																required
															/>
														</div>
													</FormGroup>
												</div>
												<div className="offset-xl-3 offset-sm-4">
													<Button type="submit" color="primary">
														Add
													</Button>

													<Button type="button" color="light">
														Discard
													</Button>
												</div>
											</Form>
										}
									</Col >

								</Row >
							</CardBody >
						</Card >
					</Col >
				</Row >
			</Container >
		</Fragment >
	);
};

export default Add_product;
