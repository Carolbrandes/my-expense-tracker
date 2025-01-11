import { useTransaction } from '../../hooks//useTransactions'
import { SkeletonTable } from './TransactionsDesk/SkeletonTable'
import SkeletonMobile from './TransactionsMobile/SkeletonMobile'

export const Skeleton = () => {
    const { isMobile } = useTransaction()

    return (
        <>
            {
                isMobile ? <SkeletonMobile /> : <SkeletonTable />
            }

        </>
    )
}


