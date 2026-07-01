interface CardListProps {
    children: React.ReactNode;
}

export default function CardList({ children }: CardListProps) {
    return <div className="flex flex-wrap gap-3 sm:gap-4">
        {children}
    </div>
}