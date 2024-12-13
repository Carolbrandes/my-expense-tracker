import { useTransaction } from '../../hooks//useTransactions'
import { SkeletonTable } from './TransactionsDesk/SkeletonTable'

export const Skeleton = () => {
    const { isMobile } = useTransaction()

    return (
        <>
            {
                isMobile ? <div>loading</div> : <SkeletonTable />
            }

        </>
    )
}


