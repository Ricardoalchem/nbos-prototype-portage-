import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

export default function IssueDashboardPage() {
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5">Issue Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Placeholder for issue tracking and portfolio review.
          </Typography>
        </Box>

        <Chip label="Placeholder" size="small" variant="outlined" />
      </Stack>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Issue Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This page is ready to be connected to the NBOS navigation shell.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
