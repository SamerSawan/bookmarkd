const TBRList = () => {
    const toReadBooks = [
      { title: "Deadhouse Gates", cover: "http://books.google.com/books/content?id=YHJCM5gF8vEC&printsec=frontcover&img=1&zoom=3&edge=curl&source=gbs_api" },
      { title: "The Blacktongue Thief", cover: "http://books.google.com/books/content?id=dvb4DwAAQBAJ&printsec=frontcover&img=1&zoom=3&edge=curl&source=gbs_api" },
      { title: "Piranesi", cover: "http://books.google.com/books/content?id=B7U8EAAAQBAJ&printsec=frontcover&img=1&zoom=3&source=gbs_api" },
      { title: "The Design of Everyday Things", cover: "http://books.google.com/books/content?id=qBfRDQAAQBAJ&printsec=frontcover&img=1&zoom=3&source=gbs_api" },
    ];
  
    return (
      <div className="mt-8 bg-back-raised rounded-lg p-4">
        <h2 className="text-xl font-bold text-secondary-strong mb-4">To Be Read</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {toReadBooks.map((book, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={book.cover}
                alt={book.title}
                className="w-48 h-72 rounded-md"
              />
              <p className="mt-2 text-md text-secondary-weak text-center">{book.title}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default TBRList;
  