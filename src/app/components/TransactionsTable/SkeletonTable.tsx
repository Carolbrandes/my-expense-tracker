import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

export const SkeletonTable = () => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Skeleton variant="text" width="80%" />
                        </TableCell>
                        <TableCell>
                            <Skeleton variant="text" width="60%" />
                        </TableCell>
                        <TableCell>
                            <Skeleton variant="text" width="40%" />
                        </TableCell>
                        <TableCell>
                            <Skeleton variant="text" width="70%" />
                        </TableCell>
                        <TableCell>
                            <Skeleton variant="text" width="50%" />
                        </TableCell>
                        <TableCell>
                            <Skeleton variant="text" width="30%" />
                        </TableCell>
                        <TableCell>
                            <Skeleton variant="text" width="30%" />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Esqueleto de linhas de tabela */}
                    {[...Array(5)].map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Skeleton variant="text" width="80%" />
                            </TableCell>
                            <TableCell>
                                <Skeleton variant="text" width="60%" />
                            </TableCell>
                            <TableCell>
                                <Skeleton variant="text" width="40%" />
                            </TableCell>
                            <TableCell>
                                <Skeleton variant="text" width="70%" />
                            </TableCell>
                            <TableCell>
                                <Skeleton variant="text" width="50%" />
                            </TableCell>
                            <TableCell>
                                <Skeleton variant="text" width="30%" />
                            </TableCell>
                            <TableCell>
                                <Skeleton variant="text" width="30%" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}


