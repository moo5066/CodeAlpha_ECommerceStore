const getCart = async (req, res) => {
  res.status(501).json({ message: 'Get cart controller not implemented yet' });
};

const addToCart = async (req, res) => {
  res.status(501).json({ message: 'Add to cart controller not implemented yet' });
};

const removeFromCart = async (req, res) => {
  res.status(501).json({ message: 'Remove from cart controller not implemented yet' });
};

module.exports = { getCart, addToCart, removeFromCart };
