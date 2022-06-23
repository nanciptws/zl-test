import cn from 'classnames'

interface ProductTagProps {
  className?: string
  name: string
  price: string
  fontSize?: number
}

const ProductTag: React.FC<ProductTagProps> = ({
  name,
  price,
  className = '',
  fontSize = 32,
}) => {
    return (<span className={cn(className)}>{price}</span>)
}

export default ProductTag
