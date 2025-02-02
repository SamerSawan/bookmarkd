const addToShelf = async (book: Book, shelfId: string, shelfName: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("You need to be logged in to add books.");
        return;
      }
      const idToken = await user.getIdToken();
      const checkBookExists = await axiosInstance.get(`/books/exists?isbn=${book.isbn}`);

      const bookExists = checkBookExists.data.exists;
      if (!bookExists) {
        await axiosInstance.post("/books", {
          title: book.title,
          authors: book.authors,
          publisher: book.publisher,
          publishedDate: book.publishedDate,
          description: book.description,
          industryIdentifiers: book.industryIdentifiers,
          pageCount: book.pageCount,
          categories: book.categories,
          imageLinks: book.imageLinks,
          language: book.language
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        console.log(`${book.title} created successfully`);
      }

      const checkBookExistsInShelf = await axiosInstance.get(`/shelves/${shelfId}/exists?isbn=${book.isbn}`)

      const bookIsInShelf = checkBookExistsInShelf.data.exists;
      if (bookIsInShelf) {
        console.log(`${book.title} already exists in target shelf!`)
        toast.error(`${book.title} is already in ${shelfName}`)
        return;
      }

      await axiosInstance.post(`/shelves/${shelfId}`, {
        isbn: book.isbn,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      refreshShelves();
      
      toast.success(`Successfully added "${book.title}" to ${shelfName}!`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to add "${book.title}" to ${shelfName}`);
    }
    
  };