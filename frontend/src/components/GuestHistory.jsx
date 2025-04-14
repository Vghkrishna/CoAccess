import React, { useState, useEffect } from "react";
import API from "../api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { showConfirm, showInfo } from "../utils/swal";
import { useNavigate } from "react-router-dom";
const permissionColors = {
  read: "#64b5f6",
  write: "#81c784",
  admin: "#e57373",
};

const GuestTable = ({ setSelectedCard }) => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [activeUser, setActiveUser] = useState(0);
  const [now, setNow] = useState(new Date());

  const rowsPerPage = 7;

  const fetchGuests = async () => {
    try {
      const response = await API.get("/guest/guestdata");

      if (!response || !response.data || !response.data.GuestsData?.length) {
        await showInfo("No guest session available.");
        setSelectedCard(null);
        navigate("/dashboard");
      }

      const activeGuests = response.data.GuestsData;
      const guestTokens = response.data.guestTokens;

      const guestsWithTokens = activeGuests.map((guest, index) => ({
        ...guest,
        token: guestTokens[index],
      }));

      setActiveUser(activeGuests);
      setGuests(guestsWithTokens);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch err data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);
  useEffect(() => {
    fetchGuests();

    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000); // update every 30 seconds

    return () => clearInterval(interval); // clean up on unmount
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  if (loading) return <div style={{ color: "white" }}>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <Paper
      sx={{
        width: "100%", // full width
        maxWidth: "100vw", // full viewport width
        height: "550px", // fixed height
        margin: "auto",
        backgroundColor: "#1e1e1e",
        borderRadius: 3,
        boxShadow: 4,
        display: "flex",
        flexDirection: "column", // so we can fix layout inside
      }}
    >
      <TableContainer sx={{ flex: 1, maxHeight: "100%", overflowY: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{
                  color: "#ffffff",
                  backgroundColor: "#1e1e1e",
                  fontSize: "18px", // increase font size
                  fontWeight: "bold",
                }}
              >
                Device Name
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: "#ffffff",
                  backgroundColor: "#1e1e1e",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Permissions
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: "#ffffff",
                  backgroundColor: "#1e1e1e",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                expire At
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: "#ffffff",
                  backgroundColor: "#1e1e1e",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Token
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: "#ffffff",
                  backgroundColor: "#1e1e1e",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Status
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {[...guests]
              .sort(
                (a, b) =>
                  new Date(b.expiresAt) - now - (new Date(a.expiresAt) - now)
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((guest, index) => (
                <TableRow key={index}>
                  <TableCell align="center" sx={{ color: "#e0e0e0" }}>
                    {guest.deviceName}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: permissionColors[guest.permissions] || "#ffffff",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {guest.permissions}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: permissionColors[guest.permissions] || "#ffffff",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    }).format(new Date(guest.expiresAt))}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#c5e1a5",
                      wordBreak: "break-word",
                      maxWidth: "100%",
                    }}
                  >
                    {guest.token}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      color:
                        new Date(guest.expiresAt) > now ? "#81c784" : "#e57373",
                    }}
                  >
                    {new Date(guest.expiresAt) > now ? "Active" : "Expired"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[7]}
        component="div"
        count={guests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        sx={{
          color: "#fff",
          ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
            {
              color: "#aaa",
            },
          ".MuiIconButton-root": {
            color: "#fff",
          },
          borderTop: "1px solid #333",
        }}
      />
    </Paper>
  );
};

export default GuestTable;
