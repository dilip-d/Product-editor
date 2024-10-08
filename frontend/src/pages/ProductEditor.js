import React, { useEffect, useState } from "react";
import axios from "axios";
import useDebounce from "../hooks/useDebounce";
import SEO from "../components/SEO";

const ProductEditor = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      setProducts(response?.data?.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebouncedSearchTerm(searchTerm);
  //   }, 300);

  //   return () => {
  //     clearTimeout(handler);
  //   };
  // }, [searchTerm]);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredProducts = products?.filter((product) =>
    product?.title?.toLowerCase().startsWith(debouncedSearchTerm?.toLowerCase())
  );

  const totalPages = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);
  const displayedProducts = filteredProducts?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const deleteSelectedProducts = () => {
    const remainingProducts = products.filter(
      (product) => !selectedRows.includes(product.id)
    );

    setProducts(remainingProducts);
    setSelectedRows([]);

    const newTotalPages = Math.ceil(remainingProducts.length / itemsPerPage);

    if (newTotalPages < page && newTotalPages > 0) {
      setPage(newTotalPages);
    } else if (newTotalPages === 0) {
      setPage(1);
    }
  };

  const getPaginationNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;

    let startPage = Math.max(1, page - 1);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const paginationNumbers = getPaginationNumbers();

  return (
    <div className="container">
      <SEO
        title="Product List"
        description="View and manage a list of products in the dashboard, including search, pagination, and deletion functionalities."
        keywords="products, e-commerce, manage, search, pagination"
        image="%PUBLIC_URL%/product-list-thumbnail  .jpg"
        url="http://localhost:3000/products"
      />

      <h1 className="heading">Product List</h1>

      <input
        type="text"
        className="search-input"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="count-section">
        Selected <div className="selected-count">{selectedRows?.length}</div>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRows(
                      displayedProducts?.map((product) => product.id)
                    );
                  } else {
                    setSelectedRows([]);
                  }
                }}
                checked={
                  selectedRows.length === displayedProducts.length &&
                  displayedProducts.length > 0
                }
              />
            </th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Brand</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Loading products...
              </td>
            </tr>
          ) : displayedProducts?.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No products available.
              </td>
            </tr>
          ) : (
            displayedProducts?.map((product) => (
              <tr
                key={product.id}
                className={
                  selectedRows?.includes(product.id) ? "selected-row" : ""
                }
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows?.includes(product.id)}
                    onChange={() => toggleRowSelection(product.id)}
                  />
                </td>
                <td>{product.title}</td>
                <td>{product.description}</td>
                <td>₹{product.price}</td>
                <td>{product.brand}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="delete-button"
          onClick={deleteSelectedProducts}
          disabled={selectedRows.length === 0}
        >
          Delete Selected
        </button>
        <div>
          <button onClick={() => handlePageChange(1)} disabled={page === 1}>
            {"<<"}
          </button>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            {"<"}
          </button>
          {paginationNumbers.map((number) => (
            <button
              key={number}
              className={`page-button ${page === number ? "active" : ""}`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            {">"}
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={page === totalPages}
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEditor;
